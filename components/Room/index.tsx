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

interface Props {
  title?: string;
}

let peers: Array<{
  peer: Peer.Instance;
  id: number;
}> = [];

export const Room: React.FC<Props> = ({ title }) => {
  const [speakers, setSpeakers] = React.useState<ISpeaker[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const socket = useSocket();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const roomId = router.query.id;

  React.useEffect(() => {
    if (window !== undefined && socket && user) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          if (!speakers.find((s) => s.id === user.id)) {
            socket.emit('CLIENT@ROOMS:JOIN', {
              user,
              roomId,
            });
          }
          socket.on('SERVER@ROOMS:JOIN', (joinedSpeakers) => {
            const peerIncome = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });

            setSpeakers(joinedSpeakers);

            joinedSpeakers.forEach((speaker) => {
              const findExistPeer = peers.find((obj) => +obj.id === +speaker.id);

              if (user.id !== speaker.id && !findExistPeer) {
                peerIncome.on('signal', (signal) => {
                  socket.emit('CLIENT@ROOMS:CALL', {
                    targetUserId: speaker.id,
                    callerUserId: user.id,
                    roomId,
                    signal,
                  });

                  peers.push({
                    peer: peerIncome,
                    id: speaker.id,
                  });
                });

                socket.on(
                  'SERVER@ROOMS:CALL',
                  ({ targetUserId, callerUserId, signal: callerSignal }) => {
                    const peerOutcome = new Peer({
                      initiator: false,
                      trickle: false,
                      stream,
                    });
                    peerOutcome.signal(callerSignal);
                    peerOutcome
                      .on('signal', (outSignal) => {
                        socket.emit('CLIENT@ROOMS:ANSWER', {
                          targetUserId: callerUserId,
                          callerUserId: targetUserId,
                          roomId,
                          signal: outSignal,
                        });
                      })
                      .on('stream', (stream) => {
                        if (audioRef.current) {
                          audioRef.current.srcObject = stream;
                          audioRef.current.play();
                        }
                      });
                  },
                );

                socket.on('SERVER@ROOMS:ANSWER', ({ callerUserId, signal }) => {
                  const obj = peers.find((obj) => +obj.id === +callerUserId);

                  if (obj) {
                    console.log('SERVER@ROOMS:ANSWER', signal);
                    obj.peer.signal(signal);
                  }
                });
              }
            });

            socket.on('SERVER@ROOMS:LEAVE', (leaveSpeaker: ISpeaker) => {
              setSpeakers((prev) =>
                prev.filter((prevSpeaker) => {
                  const peerSpeaker = peers.find((obj) => +obj.id === +leaveSpeaker.id);

                  if (peerSpeaker) {
                    peerSpeaker.peer.destroy();
                    // peers = peers.filter((p) => p.id !== peerSpeaker.id);

                    if (audioRef.current) {
                      audioRef.current.pause();
                      // audioRef.current.srcObject = null;
                    }
                  }

                  return prevSpeaker.id !== leaveSpeaker.id;
                }),
              );
            });
          });
        })
        .catch(() => {
          alert('No access to microphone.');
        });
    }

    return () => {
      peers.forEach((obj) => {
        obj.peer.destroy();
      });

      peers = [];
    };
  }, [socket, user]);

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} controls />
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
