import React from 'react';
import { useRouter } from 'next/router';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

import useUser from './useUser';
import useSocket from './useSocket';

import { Speaker as ISpeaker } from '../api-types';

const peers: Record<string, Peer.Instance> = {};

const useAudioWebRTCSocket = (audiosRef: HTMLElement | null) => {
  const [speakers, setSpeakers] = React.useState<ISpeaker[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const socket = useSocket();
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
              audiosRef?.removeChild(audioEl);
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

              audiosRef?.appendChild(newAudioElement);
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

  return {
    speakers,
    roomId,
  };
};

export default useAudioWebRTCSocket;
