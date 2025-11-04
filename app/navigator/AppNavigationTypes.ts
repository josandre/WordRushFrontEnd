import { StackNavigationProp } from "@react-navigation/stack";

export type AppRoutes = {
  Home: undefined;
  Login: { fromRegisterSuccess: boolean };
  MyTabs: undefined;
  Option: undefined;
  Signup: undefined;
  Reset: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  About: undefined;
  Contact: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  FAQ: undefined;
  Feedback: undefined;
  NotFound: undefined;
  WordGame: undefined;
  WordList: undefined;
  Flashcards: undefined;
  SettingScreen: undefined;
  Notifications: undefined;
  Help: undefined;
  Support: undefined;
  LanguageSelection: undefined;
  ThemeSelection: undefined;
  AccountSettings: undefined;
  SecuritySettings: undefined;
  SubscriptionPlans: undefined;
  PaymentMethods: undefined;
  BillingHistory: undefined;
  RedeemCode: undefined;
  InviteFriends: undefined;
  UserAchievements: undefined;
  Leaderboard: undefined;
  DailyChallenges: undefined;
  Streaks: undefined;
  Rewards: undefined;
  InviteF: undefined;
  RateApp: undefined;
  ShareApp: undefined;
  Faq: undefined;
  FeedbackForm: undefined;
  InAppBrowser: { url: string };
  UpdateProfile: undefined;
  UpdateForm: undefined;
  ResetPassword: undefined;
  GameRoom: {
    roomId: string;
    isOwner: boolean;
    players?: any[];
    roomData?: any; //TODO change this to the type
  };
  Lobby: {
    isOwner: boolean;
    roomId: string | null;
    roomData?: any; //TODO change this to the type
  };
  ConfigureLobby: undefined;
  GameConfiguration: {
    roomId: string;
  };
  JoinLobby: undefined;
};

export type AppNavigation = StackNavigationProp<AppRoutes>;
