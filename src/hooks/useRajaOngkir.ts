import { useQuery, useMutation } from '@tanstack/react-query';
import { rajaOngkirApi, Province, City, ShippingCost } from '../services/rajaOngkir';

export const useProvinces = () => {
  return useQuery<Province[], Error>({
    queryKey: ['provinces'],
    queryFn: rajaOngkirApi.getProvinces
  });
};

export const useCities = (provinceId: string) => {
  return useQuery<City[], Error>({
    queryKey: ['cities', provinceId],
    queryFn: () => rajaOngkirApi.getCities(provinceId),
    enabled: !!provinceId
  });
};

export const useCalculateShipping = () => {
  return useMutation<
    ShippingCost[],
    Error,
    {
      origin: string;
      destination: string;
      weight: number;
      courier: string;
    }
  >({
    mutationFn: rajaOngkirApi.calculateShipping
  });
}; 