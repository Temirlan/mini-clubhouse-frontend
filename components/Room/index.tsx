import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Button } from '../Button';

import styles from './Room.module.scss';
import { Speaker as ISpeaker } from '../../api-types';
import Speaker from './../Speaker/index';
import useUser from '../../hooks/useUser';
import { useRouter } from 'next/router';
import useSocket from './../../hooks/useSocket';

interface Props {
  title?: string;
}

export const Room: React.FC<Props> = ({ title }) => {
  const [speakers, setSpeakers] = React.useState<ISpeaker[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const socket = useSocket();

  React.useEffect(() => {
    if (window !== undefined && socket) {
      socket.emit('CLIENT@ROOMS:JOIN', {
        user,
        roomId: router.query.id,
      });

      socket.on('SERVER@ROOMS:JOIN', (joinedSpeakers) => setSpeakers(joinedSpeakers));

      socket.on('SERVER@ROOMS:LEAVE', (speaker: ISpeaker) => {
        setSpeakers((prev) => prev.filter((obj) => obj.id !== speaker.id));
      });
    }
  }, [socket, user]);

  return (
    <div className={styles.wrapper}>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href="/rooms">
            <a>
              <Button color="gray" className={styles.leaveButton}>
                <img width={18} height={18} src="/static/peace.png" alt="Hand black" />
                Leave quietly
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="speakers">
        {speakers.map((s) => (
          <Speaker key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
};
