import React from 'react';
import Cookies from 'js-cookie';

import { API_URL } from '../constants';
import { User } from './../api-types';

type PopupOptions = {
  width: number;
  height: number;
};

type Size = {
  width: number;
  height: number;
};

interface IParams {
  next: (user: User) => void;
  popupOptions: PopupOptions;
  authStrategy?: string;
}

interface SizeWindowsParams {
  popupSizes: Size;
  screenSizes: Size;
}

const useAuthOpenPopup = ({ next, authStrategy = 'github', popupOptions }: IParams) => {
  const { width, height } = popupOptions;

  const centeredCoordsPosition = ({ popupSizes, screenSizes }: SizeWindowsParams) => {
    const top = screenSizes.height / 2 - popupSizes.height / 2;
    const left = screenSizes.width / 2 - popupSizes.width / 2;

    return { left, top };
  };

  const authClickHandler = () => {
    const { left, top } = centeredCoordsPosition({
      popupSizes: { width, height },
      screenSizes: { width: window.outerWidth, height: window.outerHeight },
    });

    window.open(
      `${API_URL}/auth/${authStrategy}`,
      'Auth',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    );
  };

  React.useEffect(() => {
    window.addEventListener('message', ({ origin, data }) => {
      if (origin !== API_URL) return;

      const user = JSON.parse(data);
      Cookies.set('token', user.token);

      next(user);
    });

    return () => window.removeEventListener('message', () => {});
  }, []);

  return { authClickHandler };
};

export default useAuthOpenPopup;
