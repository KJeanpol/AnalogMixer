import { createStackNavigator } from 'react-navigation';

import HomeScreen from './src/screens/home';
import DashboardScreen from './src/screens/dashboard';

const App = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTransparent: true
    },
  },
  Dashboard: {
    screen: DashboardScreen,
    navigationOptions: {
      headerTransparent: true
    },
  }
})

export default App