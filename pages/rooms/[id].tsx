import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { BackButton } from '../../components/BackButton';
import { Room } from '../../components/Room';
import MainLayout from './../../layouts/MainLayout';

import { useQuery } from 'react-query';
import { RoomApi } from './../../api/RoomApi';
import { useRouter } from 'next/router';
import BuilderServerSideProps from './../../core/builder-server-side-props';
import { queryKeys } from './../../core/query-keys';

const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.id as string;
  const { data: room } = useQuery(queryKeys.Room.get(+roomId), () => RoomApi.get(+roomId));

  return (
    <>
      <MainLayout blockAfterContainer={<Room title={room?.title} />}>
        <BackButton title="All rooms" href="/rooms" />
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const builderServerSideProps = new BuilderServerSideProps(ctx);
  const roomId = ctx.params?.id;
  await builderServerSideProps.auth({
    redirectToLogin: true,
  });

  roomId && (await builderServerSideProps.room(+roomId));

  return builderServerSideProps.finalPropsResult;
};

export default RoomPage;
