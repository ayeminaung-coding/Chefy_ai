import PropTypes from 'prop-types';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RecipeCard = ({ recipe, onPress, onBookmark, isBookmarked, style }) => {
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
      <Image
        accessibilityIgnoresInvertColors
        source={{ uri: recipe.image }}
        style={styles.image}
      />

      <View style={styles.content}>
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
            color={isBookmarked ? '#16A34A' : '#6B7280'}
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
          />
        </Pressable>

        <Text numberOfLines={2} style={styles.title}>
          {recipe.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons color="#6B7280" name="time-outline" size={14} />
            <Text style={styles.metaText}>{`${recipe.readyInMinutes} min`}</Text>
          </View>

          <Text style={styles.metaDivider}>|</Text>

          <View style={styles.metaItem}>
            <Ionicons color="#6B7280" name="people-outline" size={14} />
            <Text style={styles.metaText}>{`${recipe.servings} servings`}</Text>
          </View>
        </View>

        {recipe.missedIngredientCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {`Missing ${recipe.missedIngredientCount} ingredients`}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    readyInMinutes: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    missedIngredientCount: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

RecipeCard.defaultProps = {
  onBookmark: undefined,
  isBookmarked: false,
  style: undefined,
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    width: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPressed: {
    opacity: 0.94,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    paddingRight: 36,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  metaDivider: {
    marginHorizontal: 8,
    color: '#9CA3AF',
    fontSize: 14,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  bookmarkPressed: {
    opacity: 0.72,
  },
  bookmarkDisabled: {
    opacity: 0.5,
  },
  bookmarkHitSlop: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RecipeCard;
