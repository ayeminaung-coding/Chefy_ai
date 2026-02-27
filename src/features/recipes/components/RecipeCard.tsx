import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../../core/theme';
import { RecipeItem } from '../../../types';

interface RecipeCardProps {
  recipe: RecipeItem;
  onPress: (recipe: RecipeItem) => void;
  onBookmark?: (recipe: RecipeItem) => void;
  isBookmarked?: boolean;
  style?: object | object[];
}

const RecipeCard = ({
  recipe,
  onPress,
  onBookmark,
  isBookmarked = false,
  style,
}: RecipeCardProps) => {
  const handleBookmarkPress = () => {
    if (onBookmark) {
      onBookmark(recipe);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open recipe ${recipe.title}`}
      onPress={() => onPress(recipe)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
    >
      <View style={styles.imageContainer}>
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: recipe.image }}
          style={styles.image}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isBookmarked
              ? `Remove ${recipe.title} from bookmarks`
              : `Bookmark ${recipe.title}`
          }
          accessibilityState={{ selected: isBookmarked, disabled: !onBookmark }}
          disabled={!onBookmark}
          hitSlop={styles.bookmarkHitSlop}
          onPress={handleBookmarkPress}
          style={({ pressed }) => [
            styles.bookmarkButton,
            pressed && styles.bookmarkPressed,
            !onBookmark && styles.bookmarkDisabled,
          ]}
        >
          <Ionicons
            color={isBookmarked ? COLORS.primary : COLORS.white}
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {recipe.title}
        </Text>

        {(recipe.readyInMinutes != null || recipe.servings != null) && (
          <View style={styles.metaRow}>
            {recipe.readyInMinutes != null && (
              <View style={styles.metaItem}>
                <Ionicons color={COLORS.textSecondary} name="time-outline" size={14} />
                <Text style={styles.metaText}>{`${recipe.readyInMinutes}m`}</Text>
              </View>
            )}
            {recipe.readyInMinutes != null && recipe.servings != null && (
              <View style={styles.dot} />
            )}
            {recipe.servings != null && (
              <View style={styles.metaItem}>
                <Ionicons color={COLORS.textSecondary} name="people-outline" size={14} />
                <Text style={styles.metaText}>{`${recipe.servings} serving`}</Text>
              </View>
            )}
          </View>
        )}

        {recipe.missedIngredientCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {`Missing ${recipe.missedIngredientCount} ingredients`}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.disabled,
    marginHorizontal: 8,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    backgroundColor: 'rgba(26, 26, 26, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  bookmarkPressed: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
  },
  bookmarkDisabled: {
    opacity: 0.5,
  },
  bookmarkHitSlop: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  badge: {
    backgroundColor: COLORS.error + '15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default RecipeCard;
