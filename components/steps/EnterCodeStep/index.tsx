import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import styles from './EnterCodeStep.module.scss';
import { StepInfo } from '../../StepInfo';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { useRequest } from 'ahooks';
import { UserApi } from './../../../api/UserApi';

const initCodes = ['', '', '', ''];

export const EnterCodeStep = () => {
  const [codes, setCodes] = React.useState<string[]>(initCodes);
  const router = useRouter();
  const reqActivateCode = useRequest(UserApi.getActivateCode, {
    manual: true,
  });

  const nextDisabled = reqActivateCode.loading || codes.some((v) => !v);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.getAttribute('id'));
    const value = e.target.value;

    setCodes((prev) => {
      const copyArray = [...prev];
      copyArray[index] = value;

      return copyArray;
    });

    if (value && e.target.nextSibling) {
      (e.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (e.code !== 'Backspace') return;
    if (value) return;
    if (e.currentTarget.previousSibling) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  const onSubmit = async () => {
    try {
      await reqActivateCode.run({
        code: codes.join(''),
      });

      router.push('/rooms');
    } catch (error) {
      alert('An error has occurred!');
      setCodes(initCodes);
    }
  };

  return (
    <div className={styles.block}>
      {!reqActivateCode.loading ? (
        <>
          <StepInfo icon="/static/numbers.png" title="Enter your activate code" />
          <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
            <div className={clsx('mb-30', styles.codeInput)}>
              {codes.map((code, index) => (
                <input
                  key={index}
                  type="tel"
                  id={String(index)}
                  value={code}
                  placeholder="X"
                  maxLength={1}
                  onChange={handleChangeInput}
                  onKeyDown={handleKeyDown}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <Button onClick={onSubmit} disabled={nextDisabled} className="d-inline-flex-all-center">
              Next
              <img className="size-img d-ib ml-10" src="/static/arrow.svg" />
            </Button>
          </WhiteBlock>
        </>
      ) : (
        <div className="text-center">
          <div className="loader"></div>
          <h3 className="mt-5">Activation in progress ...</h3>
        </div>
      )}
    </div>
  );
};
