import { User } from './../api-types';
import { ServerError, ServerErrors } from './../interfaces/error';
import { GetServerSidePropsResult } from 'next';

export * from './checkAuth';

export const getFormStep = (userData: User | null) => {
  if (userData) {
    if (userData.phone) return 5;
    else return 4;
  }

  return 0;
};

export const getArrayErrorMessages = (
  data: ServerErrors | Pick<ServerError, 'msg'> | undefined,
) => {
  if (data === undefined) return [];

  if ('errors' in data) {
    return data.errors.map((err) => err.msg);
  }

  return Object.values(data);
};

export const createServerSideProps = (
  arrayData: Array<
    GetServerSidePropsResult<{
      [key: string]: any;
    }>
  >,
) => {
  return arrayData.reduce((prevValue, currValue) => {
    const result: { props: any; redirect?: any } = {
      ...prevValue,
      props: {
        ...(prevValue['props'] || {}),
        ...currValue['props'],
      },
    };

    if (currValue?.['redirect'] && !prevValue?.['redirect']) {
      result.redirect = currValue?.['redirect'];
    }

    return result;
  }, {} as GetServerSidePropsResult<{ [key: string]: any }>);
};
