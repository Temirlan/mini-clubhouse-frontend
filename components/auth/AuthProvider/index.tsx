import React from 'react';
import { UserApi } from '../../../api';
import { User } from './../../../api-types';
import { useQuery } from 'react-query';
import { queryKeys } from './../../../core/query-keys';

type AuthContextType = {
  user: User | null;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  logout: async () => null,
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  useQuery(queryKeys.Auth.currentUser, UserApi.getMe, {
    onSuccess: (user) => {
      setUser(user);
    },
    onError: (error) => console.warn(error),
    retry: false,
  });

  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
