import clsx from 'clsx';
import { useRequest } from 'ahooks';

import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';

import styles from './EnterNameStep.module.scss';
import React from 'react';
import { MainContext } from '../../../pages';
import { UpdateUserDTO, User } from './../../../api-types';
import { UserApi } from './../../../api/UserApi';

export const EnterNameStep = () => {
  const { userData, setFieldValue, onNextStep } = React.useContext(MainContext);
  const [inputValue, setInputValue] = React.useState(userData.fullname || '');

  const requestUpdateUser = useRequest<User, [UpdateUserDTO]>(UserApi.updateUserRequest, {
    manual: true,
  });

  const nextDisabled = requestUpdateUser.loading || !inputValue;

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const onClickNextStep = async () => {
    try {
      setFieldValue('fullname', inputValue);

      await requestUpdateUser.run({
        fullname: inputValue,
      });

      onNextStep();
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/man.png"
        title="What's your full name?"
        description="People use real names on Clubhouse :) Thnx!"
      />
      <WhiteBlock className={clsx('m-auto', styles.whiteBlock)}>
        <div className="mb-30">
          <input
            className="field"
            value={inputValue}
            onChange={handleChangeValue}
            placeholder="Enter fullname"
          />
        </div>
        <Button
          disabled={nextDisabled}
          onClick={onClickNextStep}
          className="d-inline-flex-all-center">
          Next
          <img className="size-img d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
