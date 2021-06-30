import React from 'react';
import clsx from 'clsx';

import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { WhiteBlock } from '../../WhiteBlock';

import useAuthOpenPopup from '../../../hooks/useAuthOpenPopup';
import { MainContext } from '../../../pages';

import styles from './GithubStep.module.scss';
import Avatar from 'react-avatar';

export const GithubStep = () => {
  const { onNextStep, setUserData, userData } = React.useContext(MainContext);
  const prevUserData = React.useRef(userData);

  const { authClickHandler } = useAuthOpenPopup({
    next: (user) => {
      setUserData(user);
      onNextStep();
    },
    popupOptions: {
      width: 500,
      height: 500,
    },
  });

  return (
    <div className={styles.block}>
      <StepInfo icon="/static/connect.svg" title="Do you want import info from Github?" />

      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={clsx('mb-20', styles.avatar)}>
          <Avatar
            src={prevUserData.current?.avatarUrl}
            name={prevUserData.current?.username}
            color="#24292e"
            size="100px"
            round
          />
        </div>
        <h2 className="mb-40">{prevUserData.current?.fullname}</h2>

        <Button
          onClick={authClickHandler}
          className={clsx('d-inline-flex-all-center', styles.button)}>
          <img src="/static/github-icon.svg" alt="Twitter log" className="size-img mr-10" />
          Import from Github
          <img className="size-img d-ib ml-10" src="/static/arrow.svg" alt="arrow" />
        </Button>
        <div className="link mt-20 cup d-ib">Enter my info</div>
      </WhiteBlock>
    </div>
  );
};
