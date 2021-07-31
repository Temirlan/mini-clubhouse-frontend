import { UpdateUserDTO } from '../api-types';
import axios from '../core/axios';
import { User } from './../api-types';
import { AxiosResponse } from 'axios';
import queryString from 'query-string';
import { ServerError } from './../interfaces/error';

interface SendSmsQueryParams {
  phone: string;
}

interface ActivateCodeQueryParams {
  code: string;
}

export const getUserOnServer = async (instance = axios) => {
  const { data } = await instance.get<any, AxiosResponse<User>>('/auth/me');

  return data;
};

export const UserApi = {
  updateUserRequest: async (params: UpdateUserDTO) => {
    const { data } = await axios.patch<UpdateUserDTO, AxiosResponse<User>>('/user', params);

    return data;
  },
  getSendSmsOnPhone: async (query: SendSmsQueryParams) =>
    axios.get<SendSmsQueryParams, AxiosResponse<Pick<ServerError, 'msg'> | undefined | string>>(
      `/user/sms?${queryString.stringify(query)}`,
    ),
  getActivateCode: async (query: ActivateCodeQueryParams) =>
    axios.get<
      ActivateCodeQueryParams,
      AxiosResponse<Pick<ServerError, 'msg'> | undefined | string>
    >(`/user/sms/activate?${queryString.stringify(query)}`),
  getMe: async () => {
    const { data } = await axios.get<any, AxiosResponse<User>>('/auth/me');

    return data;
  },
  getUser: async (userId: number) => {
    const { data } = await axios.get<any, AxiosResponse<User>>(`/user/${userId}`);

    return data;
  },
};
