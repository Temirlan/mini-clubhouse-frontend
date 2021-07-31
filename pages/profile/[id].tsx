import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Profile } from './../../components/Profile/index';
import MainLayout from './../../layouts/MainLayout/index';

import { useQuery } from 'react-query';
import BuilderServerSideProps from './../../core/builder-server-side-props';
import { queryKeys } from './../../core/query-keys';
import { UserApi } from '../../api';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const { data: profileData } = useQuery(queryKeys.User.get(+userId), () =>
    UserApi.getUser(+userId),
  );

  return (
    <MainLayout>
      <Profile
        fullname={profileData?.fullname}
        username={profileData?.username}
        avatarUrl={profileData?.avatarUrl}
        about="Test Info"
      />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const builderServerSideProps = new BuilderServerSideProps(ctx);
  const userId = ctx.params?.id;
  await builderServerSideProps.auth({
    redirectToLogin: true,
  });

  userId && (await builderServerSideProps.profile(+userId));

  return builderServerSideProps.finalPropsResult;
};

export default ProfilePage;
