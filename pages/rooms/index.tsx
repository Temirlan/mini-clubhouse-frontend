import React from 'react';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { useQuery, useQueryClient } from 'react-query';

import { Button } from '../../components/Button';
import MainLayout from '../../layouts/MainLayout';
import { ConversationCard } from '../../components/ConversationCard';

import { useBoolean } from 'ahooks';
import { StartRoomModal } from '../../components/StartRoomModal';
import { RoomApi } from './../../api/RoomApi';
import BuilderServerSideProps from './../../core/builder-server-side-props';
import { queryKeys } from './../../core/query-keys';
import useSocket from './../../hooks/useSocket';
import { Room } from '../../api-types';

const RoomsPage: NextPage = () => {
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  const { data: rooms = [] } = useQuery(queryKeys.Rooms.rooms, RoomApi.getAll);
  const socket = useSocket();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (window !== undefined && socket) {
      socket.on('SERVER@ROOMS:HOME', ({ speakers, roomId }) => {
        queryClient.setQueryData('rooms', (rooms: Array<Room>) =>
          rooms.map((r) => (r.id === roomId ? { ...r, speakers } : r)),
        );
      });
    }
  }, [socket]);

  return (
    <MainLayout>
      <div className="d-flex align-items-center justify-content-between">
        <h1>All conversations</h1>

        <Button color="green" onClick={setTrue}>
          + Start room
        </Button>
      </div>
      {isOpen && <StartRoomModal onClose={setFalse} />}
      <div className="grid mt-20">
        {rooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.id}`}>
            <a>
              <ConversationCard {...room} />
            </a>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const builderServerSideProps = new BuilderServerSideProps(ctx);

  await builderServerSideProps.auth({
    redirectToLogin: true,
  });
  await builderServerSideProps.rooms();

  return builderServerSideProps.finalPropsResult;
};

export default RoomsPage;
