import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const brandApi = {
  getAllBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },
  addBrand: async (brandData: any) => {
    const response = await api.post('/brands', brandData);
    return response.data;
  }
};
