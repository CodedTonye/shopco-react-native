import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchHomeProducts } from '../store/productsSlice';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import BrandStrip from '../components/BrandStrip';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { images } from '../assets';
import { colors, type } from '../theme';

const DRESS_STYLES = [
  { name: 'Casual', slug: 'tops', image: images.dress2 },
  { name: 'Formal', slug: 'mens-shirts', image: images.dress1 },
  { name: 'Party', slug: 'womens-dresses', image: images.dress3 },
  { name: 'Gym', slug: 'womens-shoes', image: images.dress2 },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: 'Alex K.', text: 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.' },
  { name: 'James L.', text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is diverse and on-point with the latest trends." },
];

function ProductGrid({ title, products, expanded, onToggle, loading }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32 - 14) / 2;
  const shown = expanded ? products : products.slice(0, 4);
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      {loading && products.length === 0 ? (
        <ActivityIndicator style={{ marginVertical: 40 }} />
      ) : (
        <View style={styles.grid}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} width={cardWidth} starSize={16} />
          ))}
        </View>
      )}
      <Pressable style={styles.outlineBtn} onPress={onToggle}>
        <Text style={styles.outlineBtnText}>{expanded ? 'Show Less' : 'View All'}</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { newArrivals, topSelling, homeStatus } = useSelector((s) => s.products);
  const [arrivalsExpanded, setArrivalsExpanded] = useState(false);
  const [sellingExpanded, setSellingExpanded] = useState(false);
  const loading = homeStatus === 'loading';

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      {/* Child index 1 (Header) is sticky, so the nav bar stays put while the rest scrolls. */}
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        <AnnouncementBar />
        <Header />

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>FIND CLOTHES THAT MATCHES YOUR STYLE</Text>
          <Text style={styles.heroText}>
            Browse through our diverse range of meticulously crafted garments, designed to bring
            out your individuality and cater to your sense of style.
          </Text>
          <Pressable style={styles.darkBtn} onPress={() => navigation.navigate('Category', { category: 'tops' })}>
            <Text style={styles.darkBtnText}>Shop Now</Text>
          </Pressable>
          <View style={styles.stats}>
            <View>
              <Text style={styles.statNum}>200+</Text>
              <Text style={styles.statLabel}>International Brands</Text>
            </View>
            <View>
              <Text style={styles.statNum}>2,000+</Text>
              <Text style={styles.statLabel}>High-Quality Products</Text>
            </View>
            <View>
              <Text style={styles.statNum}>30,000+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
          </View>
          <View style={styles.heroImageWrap}>
            <Image source={images.hero} style={styles.heroImage} resizeMode="contain" />
            <Text style={styles.sparkBig}>✦</Text>
            <Text style={styles.sparkSmall}>✦</Text>
          </View>
        </View>

        <BrandStrip />

        <ProductGrid
          title="NEW ARRIVALS"
          products={newArrivals}
          expanded={arrivalsExpanded}
          onToggle={() => setArrivalsExpanded((v) => !v)}
          loading={loading}
        />
        <View style={styles.divider} />
        <ProductGrid
          title="TOP SELLING"
          products={topSelling}
          expanded={sellingExpanded}
          onToggle={() => setSellingExpanded((v) => !v)}
          loading={loading}
        />

        {/* Browse by dress style */}
        <View style={styles.dressWrap}>
          <Text style={styles.h2}>BROWSE BY DRESS STYLE</Text>
          {DRESS_STYLES.map((d) => (
            <Pressable
              key={d.name}
              style={styles.dressCard}
              onPress={() => navigation.navigate('Category', { category: d.slug })}
            >
              <Image source={d.image} style={styles.dressImage} resizeMode="cover" />
              <Text style={styles.dressLabel}>{d.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Testimonials */}
        <View style={{ paddingVertical: 28 }}>
          <Text style={[styles.h2, { textAlign: 'left', marginLeft: 16 }]}>OUR HAPPY CUSTOMERS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewRow}>
            {TESTIMONIALS.map((t) => (
              <View key={t.name} style={styles.review}>
                <StarRating rating={5} size={24} showValue={false} />
                <Text style={styles.reviewName}>
                  {t.name} <Text style={{ color: colors.green }}>✓</Text>
                </Text>
                <Text style={styles.reviewText}>"{t.text}"</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Newsletter />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.cream, paddingTop: 28, paddingHorizontal: 16 },
  heroTitle: { ...type.hero },
  heroText: { ...type.body, color: colors.muted, marginTop: 14 },
  darkBtn: { backgroundColor: colors.black, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  darkBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 24 },
  statNum: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.muted },
  heroImageWrap: { marginTop: 12, alignItems: 'center' },
  heroImage: { width: '100%', height: 400 },
  sparkBig: { position: 'absolute', right: 6, top: 0, fontSize: 76 },
  sparkSmall: { position: 'absolute', left: 0, top: 150, fontSize: 40 },
  section: { paddingHorizontal: 16, paddingVertical: 32 },
  h2: { ...type.h2, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24, marginTop: 22 },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', borderRadius: 999, paddingVertical: 13, paddingHorizontal: 40, alignSelf: 'center', marginTop: 28 },
  outlineBtnText: { fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  dressWrap: { backgroundColor: colors.cream, borderRadius: 24, marginHorizontal: 16, padding: 20, gap: 12 },
  dressCard: { height: 130, borderRadius: 16, backgroundColor: colors.white, overflow: 'hidden' },
  dressImage: { position: 'absolute', right: 0, top: 0, width: '75%', height: '100%' },
  dressLabel: { position: 'absolute', left: 18, top: 16, fontSize: 20, fontWeight: '800' },
  reviewRow: { paddingHorizontal: 16, gap: 14, marginTop: 20 },
  review: { width: 290, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 22, gap: 10 },
  reviewName: { fontSize: 16, fontWeight: '700' },
  reviewText: { fontSize: 14, color: colors.muted, lineHeight: 20 },
});
