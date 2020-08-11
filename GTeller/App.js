import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './scr/screens/loginScreen';
import DetailForm from './scr/screens/overallDetails';
import  PersonalDetailsScreen  from './scr/screens/PersonalDetailsScreen';
import LogoutScreen from './scr/screens/LogoutScreen'
import {Provider as AuthProvider } from './scr/context/AuthContext';
import ResolveAuthScreen from './scr/screens/ResolveAuthScreen'
import { Provider as DetailsProvider } from './scr/context/DetailsContext';
const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  Login: LoginScreen,
    

  
  mainFlow: createStackNavigator({
      OverallDetails: DetailForm,
      PersonalDetails: PersonalDetailsScreen,
      Logout: LogoutScreen
    }),

});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
    <DetailsProvider>
      <App/>
      </DetailsProvider>
    </AuthProvider>
  );
};
