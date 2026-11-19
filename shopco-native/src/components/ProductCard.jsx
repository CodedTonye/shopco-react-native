import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StarRating from './StarRating';
import { colors, type } from '../theme';

export function discountedPrice(price, discountPercentage) {
  return price - price * (discountPercentage / 100);
}

export default function ProductCard({ product, width, starSize = 14 }) {
  const navigation = useNavigation();
  const hasDiscount = product.discountPercentage > 1;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <Pressable
      style={[styles.card, width ? { width } : null]}
      onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
    >
      <View style={styles.imageBox}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {product.title}
      </Text>
      <StarRating rating={product.rating} size={starSize} />
      <View style={styles.priceRow}>
        <Text style={styles.price}>${finalPrice.toFixed(0)}</Text>
        {hasDiscount && (
          <>
            <Text style={styles.oldPrice}>${product.price.toFixed(0)}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>-{Math.round(product.discountPercentage)}%</Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4 },
  imageBox: {
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: colors.cream,
    overflow: 'hidden',
    marginBottom: 4,
  },
  image: { width: '100%', height: '100%' },
  title: { ...type.productTitle },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  price: { ...type.productPrice },
  oldPrice: { fontSize: 16, color: colors.faint, textDecorationLine: 'line-through' },
  badge: { backgroundColor: colors.redSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, color: colors.red, fontWeight: '600' },
});
