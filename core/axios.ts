import Axios from 'axios';
import { API_URL } from '../constants';
import Cookies from 'js-cookie';

const instance = Axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.headers.Authorization = `Bearer ${Cookies.get('token')}`;
  }

  return config;
});

export default instance;
