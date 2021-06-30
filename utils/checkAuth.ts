import { GetServerSidePropsContext } from 'next';

import cookie from 'cookie';

import axios from '../core/axios';
import { getUserOnServer } from './../api/UserApi';

export const checkAuth = async (context: GetServerSidePropsContext) => {
  try {
    const cookies = cookie.parse(context.req.headers.cookie);

    if (cookies.token) {
      axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
    }

    return await getUserOnServer(axios);
  } catch (error) {
    return null;
  }
};
