import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeDetailScreen from '../features/recipes/screens/RecipeDetailScreen';
import RecipeResultsScreen from '../features/recipes/screens/RecipeResultsScreen';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RecipeResults"
      component={RecipeResultsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
