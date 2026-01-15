import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InstrumentsScreen from '../screens/Instruments';
import SearchScreen from '../screens/Search';
// import SearchScreen from '../screens/SearchScreen'; asi voy a dejar las rutas
// import PortfolioScreen from '../screens/PortfolioScreen'; cuando empiece con estas screens

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Market" component={InstrumentsScreen} />
       <Tab.Screen name="Search" component={SearchScreen} />
      {/*<Tab.Screen name="Portfolio" component={PortfolioScreen} /> */}
    </Tab.Navigator>
  );
};

export default RootNavigator;