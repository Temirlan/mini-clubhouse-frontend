import { GetServerSidePropsContext } from 'next';
import cookie from 'cookie';

import axios from '../core/axios';
import { RoomApi } from './../api/RoomApi';
import { QueryClient } from 'react-query';
import { UserApi } from './../api/UserApi';

const roomsUrl = '/rooms';
const homeUrl = '/';

type Params = {
  redirectToLogin?: boolean;
  redirectToRooms?: boolean;
};

export const checkedAuthOnServer = (ctx: GetServerSidePropsContext) => (
  queryClient: QueryClient,
) => async ({ redirectToLogin = false, redirectToRooms = false } = {} as Params) => {
  const result = {
    redirect: {
      destination: homeUrl,
      permanent: false,
    },
  };

  try {
    const cookies = cookie.parse(ctx.req.headers.cookie);

    if (cookies.token) {
      axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
    }

    const data = await queryClient.fetchQuery('currentUser', UserApi.getMe);

    if (data?.isActive === 0 && redirectToLogin) {
      return result;
    }

    if (data?.isActive && redirectToRooms) {
      result.redirect.destination = roomsUrl;

      return result;
    }

    return {};
  } catch (error) {
    if (!redirectToLogin) return {};

    return result;
  }
};

export const prefetchRoomsOnServer = (ctx: GetServerSidePropsContext) => async (
  queryClient: QueryClient,
) => {
  await queryClient.prefetchQuery('rooms', RoomApi.getAll);
};

export const prefetchRoomOnServer = (ctx: GetServerSidePropsContext) => async (
  queryClient: QueryClient,
) => {
  try {
    const roomId = ctx.params.id;
    await queryClient.fetchQuery(`room-${roomId}`, () => RoomApi.get(+roomId));
  } catch (error) {
    return {
      redirect: {
        destination: roomsUrl,
        permanent: false,
      },
    };
  }
};
