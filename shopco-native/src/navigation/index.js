import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectCartCount } from '../store/cartSlice';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Shop: ['grid', 'grid-outline'],
  Cart: ['cart', 'cart-outline'],
  Account: ['person', 'person-outline'],
};

function Tabs() {
  const cartCount = useSelector(selectCartCount);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.faint,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={CategoryScreen} initialParams={{ category: 'tops' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined, tabBarBadgeStyle: { backgroundColor: colors.black } }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.white } };

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerTintColor: colors.black, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: 'Shop' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: '' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
