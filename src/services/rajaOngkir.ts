import axios from '../lib/axios';

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface ShippingCost {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: {
      value: number;
      etd: string;
      note: string;
    }[];
  }[];
}

export interface RajaOngkirResponse<T> {
  rajaongkir: {
    results: T;
  };
}

export const rajaOngkirApi = {
  getProvinces: async () => {
    const { data } = await axios.get<RajaOngkirResponse<Province[]>>('/province');
    return data.rajaongkir.results;
  },

  getCities: async (provinceId: string) => {
    const { data } = await axios.get<RajaOngkirResponse<City[]>>(`/city`, {
      params: { province: provinceId }
    });
    return data.rajaongkir.results;
  },

  calculateShipping: async (params: {
    origin_city_id: string;
    destination_city_id: string;
    weight: number;
    courier: string;
  }) => {
    const { data } = await axios.post<RajaOngkirResponse<ShippingCost[]>>('/cost', params);
    return data.rajaongkir.results;
  }
};
