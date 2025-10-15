import { StackNavigationProp } from '@react-navigation/stack';

export type AppRoutes = {
  Home: undefined;
  Login: { fromRegisterSuccess: boolean };
  MyTabs: undefined;
  Option: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};


export type AppNavigation = StackNavigationProp<AppRoutes>;;