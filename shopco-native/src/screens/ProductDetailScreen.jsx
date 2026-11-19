import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, useWindowDimensions, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchRelatedProducts } from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import StarRating from '../components/StarRating';
import ProductCard, { discountedPrice } from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { colors, type } from '../theme';

const COLORS = ['#4B3B2A', '#2F4132', '#2A3A4B'];
const SIZES = ['Small', 'Medium', 'Large', 'X-Large'];
const TABS = ['Product Details', 'Rating & Reviews', 'FAQs'];

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { current, currentStatus, related } = useSelector((s) => s.products);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState('Large');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(TABS[1]);
  const [reviewCount, setReviewCount] = useState(4);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setActiveImage(0);
    setAdded(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (current?.category) dispatch(fetchRelatedProducts({ category: current.category, excludeId: current.id }));
  }, [dispatch, current?.category, current?.id]);

  if (currentStatus === 'loading' || !current || String(current.id) !== String(id)) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const hasDiscount = current.discountPercentage > 1;
  const finalPrice = hasDiscount ? discountedPrice(current.price, current.discountPercentage) : current.price;
  const images = current.images?.length ? current.images : [current.thumbnail];
  const reviews = current.reviews || [];
  const cardWidth = (width - 32 - 14) / 2;

  function handleAdd() {
    dispatch(addToCart({ id: current.id, title: current.title, price: finalPrice, thumbnail: current.thumbnail, size, color, qty }));
    setAdded(true);
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white }} showsVerticalScrollIndicator={false}>
      <View style={styles.mainImageBox}>
        <Image source={{ uri: images[activeImage] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
        {images.slice(0, 5).map((img, i) => (
          <Pressable key={i} onPress={() => setActiveImage(i)} style={[styles.thumb, activeImage === i && styles.thumbActive]}>
            <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.pad}>
        <Text style={styles.title}>{current.title.toUpperCase()}</Text>
        <StarRating rating={current.rating} size={18} textSize={14} />
        <View style={styles.priceRow}>
          <Text style={styles.price}>${finalPrice.toFixed(0)}</Text>
          {hasDiscount && (
            <>
              <Text style={styles.oldPrice}>${current.price.toFixed(0)}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>-{Math.round(current.discountPercentage)}%</Text>
              </View>
            </>
          )}
        </View>
        <Text style={styles.desc}>{current.description}</Text>

        <View style={styles.rule} />
        <Text style={styles.label}>Select Colors</Text>
        <View style={styles.row}>
          {COLORS.map((c) => (
            <Pressable key={c} onPress={() => setColor(c)} style={[styles.swatch, { backgroundColor: c }]}>
              {color === c && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
            </Pressable>
          ))}
        </View>

        <View style={styles.rule} />
        <Text style={styles.label}>Choose Size</Text>
        <View style={styles.row}>
          {SIZES.map((s) => (
            <Pressable key={s} onPress={() => setSize(s)} style={[styles.chip, size === s && styles.chipActive]}>
              <Text style={[styles.chipText, size === s && { color: colors.white }]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.rule} />
        <View style={styles.buyRow}>
          <View style={styles.qty}>
            <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} hitSlop={8}>
              <Text style={styles.qtyBtn}>−</Text>
            </Pressable>
            <Text style={{ fontWeight: '600' }}>{qty}</Text>
            <Pressable onPress={() => setQty((q) => q + 1)} hitSlop={8}>
              <Text style={styles.qtyBtn}>+</Text>
            </Pressable>
          </View>
          <Pressable style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>{added ? 'Added to Cart ✓' : 'Add to Cart'}</Text>
          </Pressable>
        </View>
        {added && (
          <Pressable onPress={() => navigation.navigate('Main', { screen: 'Cart' })}>
            <Text style={styles.goCart}>View cart →</Text>
          </Pressable>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t && { color: colors.black, fontWeight: '700' }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'Product Details' && (
          <View style={{ gap: 8, marginTop: 16 }}>
            <Text style={styles.desc}>{current.description}</Text>
            <Text style={styles.desc}>Brand: {current.brand || 'Shop.co'}</Text>
            <Text style={styles.desc}>Warranty: {current.warrantyInformation}</Text>
            <Text style={styles.desc}>Shipping: {current.shippingInformation}</Text>
          </View>
        )}

        {tab === 'Rating & Reviews' && (
          <View style={{ marginTop: 16, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>All Reviews ({reviews.length})</Text>
            {reviews.slice(0, reviewCount).map((r, i) => (
              <View key={i} style={styles.review}>
                <StarRating rating={r.rating} size={18} showValue={false} />
                <Text style={{ fontWeight: '700', fontSize: 15 }}>
                  {r.reviewerName} <Text style={{ color: colors.green }}>✓</Text>
                </Text>
                <Text style={styles.desc}>"{r.comment}"</Text>
                <Text style={{ fontSize: 12, color: colors.faint }}>Posted on {new Date(r.date).toLocaleDateString()}</Text>
              </View>
            ))}
            {reviewCount < reviews.length && (
              <Pressable style={styles.outlineBtn} onPress={() => setReviewCount((c) => c + 4)}>
                <Text style={{ fontWeight: '600' }}>Load More Reviews</Text>
              </Pressable>
            )}
          </View>
        )}

        {tab === 'FAQs' && (
          <View style={{ gap: 8, marginTop: 16 }}>
            <Text style={styles.desc}>Return policy: {current.returnPolicy}</Text>
            <Text style={styles.desc}>Minimum order quantity: {current.minimumOrderQuantity}</Text>
            <Text style={styles.desc}>Availability: {current.availabilityStatus}</Text>
          </View>
        )}
      </View>

      {related.length > 0 && (
        <View style={[styles.pad, { marginTop: 32 }]}>
          <Text style={styles.h2}>YOU MIGHT ALSO LIKE</Text>
          <View style={styles.grid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} width={cardWidth} />
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
      <Newsletter />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainImageBox: { height: 340, backgroundColor: colors.cream },
  thumbRow: { gap: 10, padding: 16 },
  thumb: { width: 72, height: 72, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border },
  thumbActive: { borderColor: colors.black, borderWidth: 2 },
  pad: { paddingHorizontal: 16 },
  title: { ...type.h2, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  price: { fontSize: 28, fontWeight: '800' },
  oldPrice: { fontSize: 22, color: colors.faint, textDecorationLine: 'line-through' },
  badge: { backgroundColor: colors.redSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: colors.red, fontSize: 12, fontWeight: '600' },
  desc: { ...type.body, color: colors.muted, marginTop: 8 },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  label: { color: colors.muted, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  chip: { backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  chipActive: { backgroundColor: colors.black },
  chipText: { color: colors.muted, fontSize: 14 },
  buyRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 18, backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 14 },
  qtyBtn: { fontSize: 20, lineHeight: 22 },
  addBtn: { flex: 1, backgroundColor: colors.black, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  addBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  goCart: { textAlign: 'center', marginTop: 14, fontWeight: '600', textDecorationLine: 'underline' },
  tabs: { flexDirection: 'row', marginTop: 28, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabActive: { borderBottomColor: colors.black },
  tabText: { color: colors.faint, fontSize: 13 },
  review: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 18, gap: 6 },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', borderRadius: 999, paddingVertical: 13, paddingHorizontal: 32, alignSelf: 'center' },
  h2: { ...type.h2, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24, marginTop: 20 },
});
