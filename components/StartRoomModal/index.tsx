import clsx from 'clsx';
import React from 'react';
import { Button } from '../Button';

import styles from './StartRoomModal.module.scss';
import useLockBodyScroll from './../../hooks/useLockBodyScroll';
import { Room } from './../../api-types';
import { RoomApi } from './../../api/RoomApi';
import { getArrayErrorMessages } from '../../utils';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  onClose: () => void;
}

export const StartRoomModal: React.FC<Props> = ({ onClose }) => {
  const [title, setTitle] = React.useState('');
  const [roomType, setRoomType] = React.useState<Room['type']>('OPEN');
  const queryClient = useQueryClient();

  const mutation = useMutation(RoomApi.create, {
    onSuccess: (newRoom) => {
      queryClient.setQueryData('rooms', (old: Array<Room>) => [...old, newRoom]);
      onClose();
    },
    onError: (error: Error) => alert(...getArrayErrorMessages(error?.response?.data)),
  });

  useLockBodyScroll();

  const onSubmit = async () => {
    mutation.mutate({ title, type: roomType });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img
          width="24px"
          height="24px"
          src="/static/close.svg"
          alt="Close"
          className={styles.closeBtn}
          onClick={onClose}
        />
        <div className="mb-30">
          <h3>Topic</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputTitle}
            placeholder="Enter the topic to be discussed"
          />
        </div>
        <div className="mb-30">
          <h3>Room type</h3>
          <div className="d-flex justify-content-between mt-10">
            <div
              onClick={() => setRoomType('OPEN')}
              className={clsx(styles.roomType, {
                [styles.roomTypeActive]: roomType === 'OPEN',
              })}>
              <img width="70px" height="70px" src="/static/room-type-1.png" alt="Room type" />
              <h5>Open</h5>
            </div>
            <div
              onClick={() => setRoomType('SOCIAL')}
              className={clsx(styles.roomType, {
                [styles.roomTypeActive]: roomType === 'SOCIAL',
              })}>
              <img width="70px" height="70px" src="/static/room-type-2.png" alt="Room type" />
              <h5>Social</h5>
            </div>
            <div
              onClick={() => setRoomType('CLOSED')}
              className={clsx(styles.roomType, {
                [styles.roomTypeActive]: roomType === 'CLOSED',
              })}>
              <img width="70px" height="70px" src="/static/room-type-3.png" alt="Room type" />
              <h5>Closed</h5>
            </div>
          </div>
        </div>
        <div className={styles.delimiter} />
        <div className="text-center">
          <h3 className="mb-10">Start a room open to everyone</h3>
          <Button disabled={mutation.isLoading} onClick={onSubmit} color="green">
            <img width="18px" height="18px" src="/static/celebration.png" alt="Celebration" />
            Let's go
          </Button>
        </div>
      </div>
    </div>
  );
};
