import { Room } from '../api-types';
import axios from '../core/axios';
import { CreateRoomDTO } from './../api-types';
import { AxiosResponse } from 'axios';

export const RoomApi = {
  getAll: async () => {
    const { data } = await axios.get<any, AxiosResponse<Room[]>>('/rooms');

    return data;
  },
  get: async (id: number) => {
    const { data } = await axios.get<any, AxiosResponse<Room>>(`/rooms/${id}`);

    return data;
  },
  create: async (dto: CreateRoomDTO) => {
    const { data } = await axios.post<CreateRoomDTO, AxiosResponse<Room>>('/rooms', dto);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await axios.delete(`/rooms/${id}`);

    return data;
  },
};
