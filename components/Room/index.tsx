import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Button } from '../Button';

import styles from './Room.module.scss';
import Speaker from './../Speaker/index';
import useAudioWebRTCSocket from '../../hooks/useAudioWebRTCSocket';

interface Props {
  title?: string;
}

export const Room: React.FC<Props> = ({ title }) => {
  const audiosRef = React.useRef<HTMLDivElement | null>(null);
  const { speakers } = useAudioWebRTCSocket(audiosRef.current);

  return (
    <div className={styles.wrapper}>
      <div ref={audiosRef} className="audios"></div>

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
