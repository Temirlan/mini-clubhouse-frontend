import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import AuthServerSideProps from './auth';
import RoomServerSideProps from './room';
import RoomsServerSideProps from './rooms';
import ProfileServerSideProps from './profile';

type Params = {
  redirectToLogin?: boolean;
  redirectToRooms?: boolean;
  overrideRedirect?: boolean;
};

type FinalPropsResult = GetServerSidePropsResult<{ [key: string]: any }>;

export default class BuilderServerSideProps {
  queryClient: QueryClient;
  ctx: GetServerSidePropsContext;

  authServerSideProps: AuthServerSideProps;
  roomServerSideProps: RoomServerSideProps;
  roomsServerSideProps: RoomsServerSideProps;
  profileServerSideProps: ProfileServerSideProps;

  _finalPropsResult: FinalPropsResult = {
    props: {},
  };

  constructor(ctx: GetServerSidePropsContext) {
    this.queryClient = new QueryClient();
    this.ctx = ctx;
    this.authServerSideProps = new AuthServerSideProps(ctx, this.queryClient);
    this.roomServerSideProps = new RoomServerSideProps(ctx, this.queryClient);
    this.roomsServerSideProps = new RoomsServerSideProps(ctx, this.queryClient);
    this.profileServerSideProps = new ProfileServerSideProps(ctx, this.queryClient);
  }

  auth = async ({ overrideRedirect, ...restParams } = {} as Params) =>
    this.addFinalProps(await this.authServerSideProps.init(restParams), overrideRedirect);

  rooms = async () => this.addFinalProps(await this.roomsServerSideProps.init());

  room = async (roomId: number, overrideRedirect = false) =>
    this.addFinalProps(await this.roomServerSideProps.init(roomId), overrideRedirect);

  profile = async (userId: number, overrideRedirect = false) =>
    this.addFinalProps(await this.profileServerSideProps.init(userId), overrideRedirect);

  set finalPropsResult(props: FinalPropsResult) {
    this._finalPropsResult = props;
  }

  get finalPropsResult() {
    return {
      ...this._finalPropsResult,
      props: {
        dehydratedState: dehydrate(this.queryClient),
      },
    };
  }

  addFinalProps = (finalProps: FinalPropsResult | null, overrideRedirect = false) => {
    const keyRedirect = 'redirect';

    if (!finalProps) return;
    if (keyRedirect in this._finalPropsResult && keyRedirect in finalProps) {
      if (overrideRedirect) {
        this.finalPropsResult = {
          ...this._finalPropsResult,
          [keyRedirect]: {
            ...finalProps[keyRedirect],
          },
        };
      }
      return;
    }

    this.finalPropsResult = finalProps;
  };
}
