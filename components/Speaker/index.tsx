import Avatar from 'react-avatar';
import React from 'react';
import clsx from 'clsx';

import { Speaker as ISpeaker } from '../../api-types';
import styles from './Speaker.module.scss';

interface Props {
  isVoice?: boolean;
}

const Speaker: React.FC<Props & ISpeaker> = ({ fullname, avatarUrl, isVoice }) => {
  return (
    <div className="d-inline-flex-all-center flex-column mr-40 mb-40">
      <Avatar
        className={clsx(isVoice && styles.avatarWithDoubleBorder)}
        round
        src={avatarUrl}
        name={fullname}
        size="100px"
      />
      <div className="mt-10">
        <b>{fullname}</b>
      </div>
    </div>
  );
};

export default Speaker;
