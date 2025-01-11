import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './ShippingCalculator.scss';
import { useProvinces, useCities, useCalculateShipping } from '../../hooks/useRajaOngkir';
import { ShippingCost } from '../../services/rajaOngkir';

interface CourierOption {
  id: string;
  name: string;
  color: string;
}

const COURIERS: CourierOption[] = [
  { id: 'jne', name: 'JNE', color: '#e8fff1' },
  { id: 'pos', name: 'POS', color: '#fff5e6' },
  { id: 'tiki', name: 'TIKI', color: '#f3e8ff' }
];

const ShippingCalculator: React.FC = () => {
  const [shippingResults, setShippingResults] = useState<ShippingCost[]>([]);

  const formik = useFormik({
    initialValues: {
      originProvince: '',
      originCity: '',
      destinationProvince: '',
      destinationCity: '',
      weight: '',
      courier: ''
    },
    validationSchema: Yup.object({
      originProvince: Yup.string().required('Provinsi asal harus dipilih'),
      originCity: Yup.string().required('Kota asal harus dipilih'),
      destinationProvince: Yup.string().required('Provinsi tujuan harus dipilih'),
      destinationCity: Yup.string().required('Kota tujuan harus dipilih'),
      weight: Yup.string()
        .required('Berat harus diisi')
        .test('is-valid-weight', 'Berat harus lebih dari 0', value => {
          if (!value) return false;
          const weight = parseFloat(value);
          return !isNaN(weight) && weight > 0;
        }),
      courier: Yup.string().required('Kurir harus dipilih')
    }),
    onSubmit: async (values) => {
      try {
        const result = await calculateShipping.mutateAsync({
          origin: values.originCity,
          destination: values.destinationCity,
          weight: parseFloat(values.weight),
          courier: values.courier
        });
        setShippingResults(result);
      } catch (error) {
        console.error('Error calculating shipping:', error);
      }
    }
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  
  const { data: originCities, isLoading: isLoadingOriginCities } = useCities(
    formik.values.originProvince
  );
  
  const { data: destinationCities, isLoading: isLoadingDestinationCities } = useCities(
    formik.values.destinationProvince
  );

  const calculateShipping = useCalculateShipping();

  

  return (
    <div className="shipping-calculator">
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Check Ongkir / Cek Tarif</h1>
          <p className="subtitle">
            Cek ongkos kirim gratis untuk ekspedisi semua daerah di Indonesia menggunakan jasa kurir JNE, POS, dan Tiki
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="calculator-form">
          <div className="form-section">
            <h2>Asal</h2>
            <div className="form-group">
              <label>Provinsi:</label>
              <select
                {...formik.getFieldProps('originProvince')}
                className="form-control"
                disabled={isLoadingProvinces}
              >
                <option value="">Pilih Provinsi</option>
                {provinces?.map(province => (
                  <option key={province.province_id} value={province.province_id}>
                    {province.province}
                  </option>
                ))}
              </select>
              {formik.touched.originProvince && formik.errors.originProvince && (
                <div className="error-message">{formik.errors.originProvince}</div>
              )}
            </div>

            <div className="form-group">
              <label>Kota/Kabupaten:</label>
              <select
                {...formik.getFieldProps('originCity')}
                className="form-control"
                disabled={!formik.values.originProvince || isLoadingOriginCities}
              >
                <option value="">Pilih Kota</option>
                {originCities?.map(city => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.type} {city.city_name}
                  </option>
                ))}
              </select>
              {formik.touched.originCity && formik.errors.originCity && (
                <div className="error-message">{formik.errors.originCity}</div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Tujuan</h2>
            <div className="form-group">
              <label>Provinsi:</label>
              <select
                {...formik.getFieldProps('destinationProvince')}
                className="form-control"
                disabled={isLoadingProvinces}
              >
                <option value="">Pilih Provinsi</option>
                {provinces?.map(province => (
                  <option key={province.province_id} value={province.province_id}>
                    {province.province}
                  </option>
                ))}
              </select>
              {formik.touched.destinationProvince && formik.errors.destinationProvince && (
                <div className="error-message">{formik.errors.destinationProvince}</div>
              )}
            </div>

            <div className="form-group">
              <label>Kota/Kabupaten:</label>
              <select
                {...formik.getFieldProps('destinationCity')}
                className="form-control"
                disabled={!formik.values.destinationProvince || isLoadingDestinationCities}
              >
                <option value="">Pilih Kota</option>
                {destinationCities?.map(city => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.type} {city.city_name}
                  </option>
                ))}
              </select>
              {formik.touched.destinationCity && formik.errors.destinationCity && (
                <div className="error-message">{formik.errors.destinationCity}</div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Berat</h2>
            <div className="weight-input">
              <input
                type="text"
                {...formik.getFieldProps('weight')}
                className="form-control"
                placeholder="Total Berat"
              />
              <span className="weight-unit">Kg</span>
            </div>
          </div>

          <div className="form-section">
            <h2>Kurir</h2>
            <div className="courier-options">
              {COURIERS.map(courier => (
                <button
                  key={courier.id}
                  type="button"
                  className={`courier-button ${formik.values.courier === courier.id ? 'active' : ''}`}
                  style={{ backgroundColor: courier.color }}
                  onClick={() => formik.setFieldValue('courier', courier.id)}
                >
                  {courier.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="calculate-button"
              disabled={!formik.isValid || calculateShipping.isPending}
            >
              {calculateShipping.isPending ? 'Menghitung...' : 'Cek Ongkir'}
            </button>
          </div>

          {calculateShipping.isPending && (
            <div className="loading">Menghitung ongkos kirim...</div>
          )}

          {shippingResults.length > 0 && (
            <div className="shipping-container">
              <div className="shipping-results">
                {shippingResults.map((result, index) => (
                  <div key={index} className="shipping-result">
                    <div className="service-name">
                      {result.name}
                    </div>
                    {result.costs.map((cost, costIndex) => (
                      <div key={costIndex} className="service-option">
                        <div className="service-name">
                          {cost.service} - {cost.description}
                        </div>
                        <div className="service-cost">
                          <div>Rp {cost.cost[0].value.toLocaleString()}</div>
                          <div className="etd">Estimasi: {cost.cost[0].etd} hari</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShippingCalculator; 