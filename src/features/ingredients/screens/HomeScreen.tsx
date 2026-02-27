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
import { COLORS } from '../../../core/theme';
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello Chef! 👋</Text>
            <Text style={styles.title}>What's in your fridge?</Text>
          </View>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              <Text style={styles.counterActive}>{selectedIngredients.length}</Text>
              <Text style={styles.counterTotal}>/5</Text>
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Icon color={COLORS.textSecondary} name="search" size={20} />
          <TextInput
            placeholder="Search ingredients..."
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Ingredients</Text>
            <Text style={styles.sectionSubtitle}>Select 2–5 ingredients</Text>
          </View>

          <IngredientSelector
            ingredients={filteredIngredients}
            maxSelection={5}
            onSelectionChange={setSelectedIngredients}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  counterContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  counterText: {
    fontSize: 16,
    fontWeight: '700',
  },
  counterActive: {
    color: COLORS.primary,
  },
  counterTotal: {
    color: COLORS.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default HomeScreen;
