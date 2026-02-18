import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FavoritesScreen from "../features/favorites/screens/FavoritesScreen";
import HomeScreen from "../features/ingredients/screens/HomeScreen";
import SettingsScreen from "../features/settings/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
