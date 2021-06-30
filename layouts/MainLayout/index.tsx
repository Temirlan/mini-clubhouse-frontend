import Head from 'next/Head';
import React from 'react';
import { Header } from './../../components/Header';

interface Props {
  children: React.ReactNode;
  blockAfterContainer?: React.ReactNode;
  titleHead?: string;
}

const MainLayout: React.FC<Props> = ({
  children,
  blockAfterContainer,
  titleHead = 'Clubhouse: Drop-in audio chat',
}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{titleHead}</title>
      </Head>
      <Header />
      <div className="container mt-40">{children}</div>
      {blockAfterContainer}
    </>
  );
};

export default MainLayout;
