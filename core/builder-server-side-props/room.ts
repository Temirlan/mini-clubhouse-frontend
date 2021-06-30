import { GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { redirectUrlDict } from './../constants';
import { RoomApi } from './../../api/RoomApi';
import { queryKeys } from './../query-keys';

export default class RoomServerSideProps {
  queryClient: QueryClient;
  ctx: GetServerSidePropsContext;

  constructor(ctx: GetServerSidePropsContext, queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.ctx = ctx;
  }

  init = async (roomId: number) => {
    try {
      await this.queryClient.fetchQuery(queryKeys.Room.get(roomId), () => RoomApi.get(roomId));

      return null;
    } catch (error) {
      return {
        redirect: {
          destination: redirectUrlDict.roomsUrl,
          permanent: false,
        },
      };
    }
  };
}
