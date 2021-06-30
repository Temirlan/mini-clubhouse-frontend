import Avatar from 'react-avatar';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div className={clsx(styles.headerLogo, 'd-flex align-items-center cup')}>
            <img src="/static/hand-wave.png" alt="Logo" width="30px" />
            <h4>Clubhouse</h4>
          </div>
        </Link>

        <Link href="/profile/1">
          <div className="d-flex align-items-center cup">
            <b className="mr-5">Ismagulov Temirlan</b>
            <Avatar
              src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3'"
              size="50px"
              round
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
