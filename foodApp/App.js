import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import resultsShowScreen from './scr/screens/resultsShowScreen';
import searchScreen from './scr/screens/searchScreen';

const navigator = createStackNavigator(
  {
    Search: searchScreen,
    ResultsShow: resultsShowScreen
  },
  {
    initialRouteName: 'Search',
    defaultNavigationOptions: {
      title: 'Business Search',
    },
  }
);

export default createAppContainer(navigator);