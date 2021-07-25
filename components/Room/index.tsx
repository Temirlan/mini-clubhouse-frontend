import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Button } from '../Button';

import styles from './Room.module.scss';
import io, { Socket } from 'socket.io-client';
import { API_URL } from './../../constants';
import { Speaker as ISpeaker } from '../../api-types';
import Speaker from './../Speaker/index';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import useUser from '../../hooks/useUser';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
}

export const Room: React.FC<Props> = ({ title }) => {
  const socketRef = React.useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [speakers, setSpeakers] = React.useState<ISpeaker[]>([]);
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (window !== undefined) {
      socketRef.current = io(API_URL);

      socketRef.current.emit('CLIENT@ROOMS:JOIN', {
        user,
        roomId: router.query.id,
      });

      socketRef.current.on('SERVER@ROOMS:JOIN', (joinedSpeakers) => setSpeakers(joinedSpeakers));

      socketRef.current.on('SERVER@ROOMS:LEAVE', (speaker: ISpeaker) => {
        setSpeakers((prev) => prev.filter((obj) => obj.id !== speaker.id));
      });
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

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
