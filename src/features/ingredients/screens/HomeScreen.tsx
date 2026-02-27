import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { PrimaryButton } from '../../../core/components';
import { Colors, useAppTheme } from '../../../core/theme';
import { INGREDIENT_LIST } from '../../../services/api/mockData';
import { RootStackParamList, TabParamList } from '../../../types';
import IngredientSelector from '../components/IngredientSelector';

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeNavProp;
}

const HomeScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return INGREDIENT_LIST;
    }
    return INGREDIENT_LIST.filter(name => name.toLowerCase().includes(q));
  }, [searchQuery]);

  const isFindRecipesDisabled = useMemo(
    () => selectedIngredients.length < 2,
    [selectedIngredients.length],
  );

  const handleFindRecipes = () => {
    navigation.navigate('RecipeResults', {
      ingredients: selectedIngredients,
    });
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <SafeAreaView style={s.safeArea}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hello Chef! 👋</Text>
            <Text style={s.title}>What's in your fridge?</Text>
          </View>
          <View style={s.counterContainer}>
            <Text style={s.counterText}>
              <Text style={s.counterActive}>{selectedIngredients.length}</Text>
              <Text style={s.counterTotal}>/5</Text>
            </Text>
          </View>
        </View>

        <View style={s.searchContainer}>
          <Icon color={colors.textSecondary} name="search" size={20} />
          <TextInput
            placeholder="Search ingredients..."
            placeholderTextColor={colors.textSecondary}
            style={s.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Select Ingredients</Text>
            <Text style={s.sectionSubtitle}>Select 2–5 ingredients</Text>
          </View>

          <IngredientSelector
            ingredients={filteredIngredients}
            maxSelection={5}
            onSelectionChange={setSelectedIngredients}
          />
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <PrimaryButton
          disabled={isFindRecipesDisabled}
          onPress={handleFindRecipes}
          title={
            isFindRecipesDisabled
              ? 'Select at Least 2 Ingredients'
              : 'Find Delicious Recipes'
          }
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    safeArea: { backgroundColor: colors.background },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
    },
    greeting: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 4 },
    title: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    counterContainer: {
      backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 16, borderWidth: 1, borderColor: colors.border,
      ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 0 } }),
    },
    counterText: { fontSize: 16, fontWeight: '700' },
    counterActive: { color: colors.primary },
    counterTotal: { color: colors.textSecondary },
    searchContainer: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
      marginHorizontal: 24, paddingHorizontal: 16, height: 54, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border, marginTop: 8, marginBottom: 8,
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: colors.text },
    scrollContent: { paddingBottom: 120 },
    content: { paddingHorizontal: 24, paddingTop: 16 },
    sectionHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'baseline', marginBottom: 20,
    },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
    sectionSubtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    bottomBar: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: colors.background, paddingHorizontal: 24,
      paddingTop: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.border,
    },
  });

export default HomeScreen;
