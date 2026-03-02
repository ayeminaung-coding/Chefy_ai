import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import RecipeDetailScreen from '../features/recipes/screens/RecipeDetailScreen';
import RecipeResultsScreen from '../features/recipes/screens/RecipeResultsScreen';
import useAuthStore from '../store/authStore';
import { AuthStackParamList, RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="Tabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="RecipeResults"
      component={RecipeResultsScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

const AppNavigator = () => {
  const { user, initializing } = useAuthStore();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
