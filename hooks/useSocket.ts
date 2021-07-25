import React from 'react';
import io, { Socket } from 'socket.io-client';

import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { API_URL } from './../constants';

const useSocket = () => {
  const socketRef = React.useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  React.useEffect(() => {
    if (window !== undefined) {
      socketRef.current = io(API_URL);
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
