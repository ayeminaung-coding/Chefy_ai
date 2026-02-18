import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeDetailScreen from "../features/recipes/screens/RecipeDetailScreen";
import RecipeResultsScreen from "../features/recipes/screens/RecipeResultsScreen";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeResults"
        component={RecipeResultsScreen}
        options={{ title: "Recipe Results" }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: "Recipe Detail" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
