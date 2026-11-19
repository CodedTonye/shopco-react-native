import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectCartCount } from '../store/cartSlice';
import { logos } from '../assets';
import { colors } from '../theme';

// Fixed top bar: wordmark, tappable search pill, cart. Rendered outside (or as a
// sticky child of) the scroll view so it never scrolls away.
export default function Header() {
  const navigation = useNavigation();
  const count = useSelector(selectCartCount);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Image source={logos.shopco} style={styles.logo} resizeMode="contain" />
      </Pressable>
      <Pressable style={styles.search} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search-outline" size={16} color={colors.faint} />
        <Text style={styles.placeholder}>Search for products...</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Cart')} hitSlop={8}>
        <Ionicons name="cart-outline" size={26} color={colors.black} />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: { width: 104, height: 20 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.grey,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  placeholder: { color: colors.faint, fontSize: 13 },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
});
