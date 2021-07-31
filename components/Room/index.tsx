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
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

interface Props {
  title?: string;
}

const peers: Record<string, Peer.Instance> = {};

export const Room: React.FC<Props> = ({ title }) => {
  const [speakers, setSpeakers] = React.useState<ISpeaker[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const socket = useSocket();
  const audiosRef = React.useRef<HTMLDivElement | null>(null);
  const roomId = router.query.id;

  React.useEffect(() => {
    if (window !== undefined && socket && user && !speakers.find((s) => s.id === user.id)) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          socket.emit('client join to room', {
            user,
            roomId,
          });

          socket.on('speakers', (speakers) => setSpeakers(speakers));

          socket.on('init connection receiver', (socketId) => {
            addPeer(socketId, socket, {
              initiator: false,
              trickle: false,
              stream,
            });

            socket.emit('create initiator peer', socketId);
          });

          socket.on('init connection sender', (socketId) => {
            addPeer(socketId, socket, {
              initiator: true,
              trickle: false,
              stream,
            });
          });

          socket.on('user leave to room', ({ socketId, userId }) => {
            removePeer(socketId);

            setSpeakers((prev) => prev.filter((p) => p.id !== userId));
          });

          socket.on('signal', ({ socketId, signal }) => {
            !peers[socketId].connected && peers[socketId].signal(signal);
          });

          function removePeer(socketId: string) {
            const audioEl = document.getElementById(socketId) as HTMLAudioElement;

            if (audioEl) {
              audioEl.srcObject = null;
              audiosRef.current?.removeChild(audioEl);
            }

            peers[socketId] && peers[socketId].destroy();
            delete peers[socketId];
          }

          function addPeer(
            socketId: string,
            socket: Socket<DefaultEventsMap, DefaultEventsMap>,
            peerOpts: Peer.Options,
          ) {
            peers[socketId] = new Peer(peerOpts);

            peers[socketId].on('signal', (data) => {
              socket.emit('signal', {
                signal: data,
                socketId,
              });
            });

            peers[socketId].on('stream', (stream) => {
              const newAudioElement = document.createElement('audio');
              newAudioElement.srcObject = stream;
              newAudioElement.id = socketId;
              newAudioElement.autoplay = true;

              audiosRef.current?.appendChild(newAudioElement);
            });
          }
        })
        .catch(() => {
          alert('No access to microphone.');
        });
    }

    return () => {
      for (const socketId in peers) {
        peers[socketId].destroy();
      }
    };
  }, [socket, user]);

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
