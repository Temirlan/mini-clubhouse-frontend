import { GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { redirectUrlDict } from './../constants';
import { RoomApi } from './../../api/RoomApi';
import { queryKeys } from './../query-keys';

export default class RoomsServerSideProps {
  queryClient: QueryClient;
  ctx: GetServerSidePropsContext;

  constructor(ctx: GetServerSidePropsContext, queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.ctx = ctx;
  }

  init = async () => {
    await this.queryClient.prefetchQuery(queryKeys.Rooms.rooms, RoomApi.getAll);

    return null;
  };
}
