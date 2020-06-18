/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/pages/HomeScreen';
import {name as appName} from './app.json';
import bgMessaging from './src/pages/bgMessaging'
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 