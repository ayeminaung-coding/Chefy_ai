import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppTheme } from '../core/theme';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import HomeScreen from '../features/ingredients/screens/HomeScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { active: string; inactive: string }> = {
  Home:      { active: 'home',      inactive: 'home-outline' },
  Favorites: { active: 'heart',     inactive: 'heart-outline' },
  Settings:  { active: 'settings',  inactive: 'settings-outline' },
};

const TabNavigator = () => {
  const { colors } = useAppTheme();

  const screenOptions = ({ route }: { route: { name: keyof TabParamList } }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarStyle: {
      backgroundColor: colors.white,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: 62,
      paddingBottom: 8,
      paddingTop: 6,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
    },
    tabBarIcon: ({ focused, color, size }) => {
      const icons = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
      return (
        <Ionicons
          name={focused ? icons.active : icons.inactive}
          size={size ?? 22}
          color={color}
        />
      );
    },
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home"      component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
