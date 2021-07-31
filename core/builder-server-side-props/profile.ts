import { GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { redirectUrlDict } from './../constants';
import { UserApi } from './../../api/UserApi';
import { queryKeys } from './../query-keys';

export default class ProfileServerSideProps {
  queryClient: QueryClient;
  ctx: GetServerSidePropsContext;

  constructor(ctx: GetServerSidePropsContext, queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.ctx = ctx;
  }

  init = async (userId: number) => {
    try {
      await this.queryClient.fetchQuery(queryKeys.User.get(userId), () => UserApi.getUser(userId));

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
