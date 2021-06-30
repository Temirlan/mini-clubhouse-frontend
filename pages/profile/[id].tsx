import { useRouter } from 'next/router';
import React from 'react';
import { Profile } from './../../components/Profile/index';
import MainLayout from './../../layouts/MainLayout/index';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout>
      <Profile
        fullname="Ismagulov Temirlan"
        username="ismagulov"
        avatarUrl="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3'"
        about="Test Info"
      />
    </MainLayout>
  );
}
