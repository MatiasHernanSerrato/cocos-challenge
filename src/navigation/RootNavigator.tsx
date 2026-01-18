import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InstrumentsScreen from '../screens/Instruments';
import SearchScreen from '../screens/Search';
import PortfolioScreen from '../screens/Portfolio';
import OrdersHistoryScreen from '../screens/OrdersHistory';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Mercado" component={InstrumentsScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Portafolio" component={PortfolioScreen} />
      <Tab.Screen name="Historial" component={OrdersHistoryScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;