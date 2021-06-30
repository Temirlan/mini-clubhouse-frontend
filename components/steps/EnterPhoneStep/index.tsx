import clsx from 'clsx';
import React from 'react';
import NumberFormat from 'react-number-format';

import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { WhiteBlock } from '../../WhiteBlock';

import styles from './EnterPhoneStep.module.scss';
import { useRequest } from 'ahooks';
import { MainContext } from '../../../pages';
import { getArrayErrorMessages } from '../../../utils';
import { UserApi } from './../../../api/UserApi';

type InputValueState = {
  formattedValue: string;
  value: string;
};

const phoneMask = '_';

export const EnterPhoneStep = () => {
  const { onNextStep, setFieldValue } = React.useContext(MainContext);
  const [values, setValues] = React.useState<InputValueState>({} as InputValueState);

  const reqSendSmsOnPhone = useRequest(UserApi.getSendSmsOnPhone, {
    manual: true,
  });

  const errMessages = React.useMemo(
    () => getArrayErrorMessages(reqSendSmsOnPhone?.error?.response?.data),
    [reqSendSmsOnPhone, reqSendSmsOnPhone?.error],
  );

  const nextDisabled =
    !values.formattedValue ||
    values.formattedValue.includes(phoneMask) ||
    reqSendSmsOnPhone.loading;

  const onSubmit = async () => {
    try {
      setFieldValue('phone', values.value);

      await reqSendSmsOnPhone.run({
        phone: values.value,
      });

      onNextStep();
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/phone.png"
        title="Enter your phone #"
        description="We will send you a confirmation code"
      />

      <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
        <div className={clsx('mb-30', styles.input)}>
          <img src="/static/kazakhstan-flag.svg" alt="flag" width={34} height={26} />
          <NumberFormat
            className="field pl-55"
            format="+# (###) ###-##-##"
            mask={phoneMask}
            placeholder="+7 (999) 333-22-11"
            value={values.value}
            onValueChange={({ formattedValue, value }) => setValues({ formattedValue, value })}
          />
        </div>

        {errMessages.map((msg, key) => (
          <p className="error" key={key}>
            {msg}
          </p>
        ))}

        <Button onClick={onSubmit} className="d-inline-flex-all-center" disabled={nextDisabled}>
          Next
          <img className="size-img d-ib ml-10" src="/static/arrow.svg" />
        </Button>

        <p className={clsx(styles.policyText, 'mt-30')}>
          By entering your number, you're agreeing to our Terms of Service and Privacy Policy.
          Thanks!
        </p>
      </WhiteBlock>
    </div>
  );
};
