import clsx from 'clsx';
import Avatar from 'react-avatar';
import React from 'react';
import { useRequest } from 'ahooks';

import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { WhiteBlock } from '../../WhiteBlock';

import styles from './ChooseAvatarStep.module.scss';
import { MainContext } from '../../../pages';

import axios from '../../../core/axios';

const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const { data } = await axios.post('/user/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const ChooseAvatarStep = () => {
  const { onNextStep, userData } = React.useContext(MainContext);
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(userData?.avatarUrl);
  const requestUploadAvatar = useRequest<string, [file: File]>(uploadAvatar, {
    manual: true,
  });

  const title = React.useMemo(
    () => (userData?.fullname ? `Okay, ${userData?.fullname}!` : 'Okay'),
    [],
  );

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (!file) return;

    e.target.value = '';
    const data = await requestUploadAvatar.run(file);

    setAvatarUrl(data);
  };

  return (
    <div className={styles.block}>
      <StepInfo icon="/static/celebration.png" title={title} description="How's this photo?" />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar color="#5677AD" name={userData?.fullname} size="120px" src={avatarUrl} round />
        </div>

        <div className="mb-30">
          <label
            htmlFor="image"
            className={clsx(requestUploadAvatar.loading ? 'animation-text' : '', 'link cup')}>
            Choose a different photo
          </label>
        </div>

        <input
          id="image"
          type="file"
          onChange={handleChangeImage}
          hidden
          disabled={requestUploadAvatar.loading}
        />

        <Button disabled={requestUploadAvatar.loading} onClick={onNextStep}>
          Next
          <img className="size-img d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
