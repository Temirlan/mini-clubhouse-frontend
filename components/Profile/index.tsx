import clsx from 'clsx';
import React from 'react';
import Avatar from 'react-avatar';
import Link from 'next/link';

import { Button } from '../Button';

import styles from './Profile.module.scss';
import { BackButton } from '../BackButton';

interface Props {
  username?: string;
  about: string;
  fullname?: string;
  avatarUrl?: string;
}

export const Profile: React.FC<Props> = ({ fullname, username, about, avatarUrl }) => {
  return (
    <>
      <BackButton title="Back" href="/rooms" />

      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Avatar src={avatarUrl} size="100px" round />
          <div className="d-flex flex-column ml-30 mr-30">
            <h2 className="mt-0 mb-0">{fullname}</h2>
            <h3 className={clsx(styles.username, 'mt-0 mb-0')}>@{username}</h3>
          </div>
        </div>
        <Button className={styles.followButton} color="blue">
          Follow
        </Button>
      </div>

      <p className={styles.about}>{about}</p>
    </>
  );
};
