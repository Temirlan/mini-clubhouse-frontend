import React from 'react';
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from './../components/steps/EnterNameStep';
import { GithubStep } from './../components/steps/GithubStep';
import { ChooseAvatarStep } from './../components/steps/ChooseAvatarStep';
import { EnterPhoneStep } from './../components/steps/EnterPhoneStep';
import { EnterCodeStep } from './../components/steps/EnterCodeStep';
import { User } from './../api-types';
import { checkedAuthOnServer } from './../core/server-side-props';
import { getFormStep } from './../utils/index';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import BuilderServerSideProps from './../core/builder-server-side-props';

const stepsComponents = {
  0: WelcomeStep,
  1: GithubStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

type MainContextProps = {
  step: number;
  onNextStep: () => void;
  userData?: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
  setFieldValue: (field: keyof User, value: string) => void;
};

interface Props {
  userData: User;
}

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

const Home: React.FC<Props> = (props) => {
  const initStep = React.useMemo(() => getFormStep(props.userData), [props.userData]);
  const [step, setStep] = React.useState<number>(initStep);
  const [userData, setUserData] = React.useState(props.userData);
  const Step = stepsComponents[step];

  const onNextStep = React.useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const setFieldValue = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <MainContext.Provider
      value={{
        step,
        onNextStep,
        userData,
        setUserData,
        setFieldValue,
      }}>
      <Step />
    </MainContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const builderServerSideProps = new BuilderServerSideProps(ctx);

  await builderServerSideProps.auth({
    redirectToRooms: true,
  });

  return builderServerSideProps.finalPropsResult;
};

export default Home;
