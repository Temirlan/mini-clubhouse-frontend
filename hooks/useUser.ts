import React from 'react';
import { AuthContext } from './../components/auth/AuthProvider';

const useUser = () => {
  const authContext = React.useContext(AuthContext);

  return authContext;
};

export default useUser;
