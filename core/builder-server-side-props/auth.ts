import cookie from 'cookie';

import axios from '../axios';
import { UserApi } from '../../api';
import { GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { redirectUrlDict } from './../constants';
import { queryKeys } from './../query-keys';

type Params = {
  redirectToLogin?: boolean;
  redirectToRooms?: boolean;
};

export default class AuthServerSideProps {
  queryClient: QueryClient;
  ctx: GetServerSidePropsContext;

  constructor(ctx: GetServerSidePropsContext, queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.ctx = ctx;
  }

  init = async (params = {} as Params) => {
    const { redirectToLogin = false, redirectToRooms = false } = params;

    const result = {
      redirect: {
        destination: redirectUrlDict.homeUrl,
        permanent: false,
      },
    };

    try {
      const cookies = cookie.parse(this.ctx.req.headers.cookie);

      if (cookies.token) {
        axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
      }

      const data = await this.queryClient.fetchQuery(queryKeys.Auth.currentUser, UserApi.getMe);

      if (data?.isActive === 0 && redirectToLogin) {
        return result;
      }

      if (data?.isActive && redirectToRooms) {
        result.redirect.destination = redirectUrlDict.roomsUrl;

        return result;
      }

      return null;
    } catch (error) {
      if (!redirectToLogin) return null;

      return result;
    }
  };
}
