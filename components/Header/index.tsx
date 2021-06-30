import Avatar from 'react-avatar';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import styles from './Header.module.scss';
import useUser from '../../hooks/useUser';

export const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div className={clsx(styles.headerLogo, 'd-flex align-items-center cup')}>
            <img src="/static/hand-wave.png" alt="Logo" width="30px" />
            <h4>Clubhouse</h4>
          </div>
        </Link>

        <Link href={`/profile/${user?.id}`}>
          <div className="d-flex align-items-center cup">
            <b className="mr-5">{user?.fullname || 'New'}</b>
            <Avatar src={user?.avatarUrl} size="50px" name={user?.fullname} round />
          </div>
        </Link>
      </div>
    </div>
  );
};
