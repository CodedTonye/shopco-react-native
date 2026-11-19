import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategoryProducts } from '../store/productsSlice';
import { setSort } from '../store/filtersSlice';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FilterModal from '../components/FilterModal';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { colors, type } from '../theme';

const PAGE_SIZE = 10;
const SORT_OPTIONS = ['Most Popular', 'Price: Low to High', 'Price: High to Low', 'Newest'];

function titleCase(slug = '') {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Used for both the "Shop" tab and the stack "Category" screen (e.g. from dress styles).
export default function CategoryScreen({ route, navigation }) {
  const category = route.params?.category || 'tops';
  const isTab = route.name === 'Shop';
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32 - 14) / 2;

  const { items, total, status } = useSelector((s) => s.products.category);
  const { sortBy, order, priceMin, priceMax } = useSelector((s) => s.filters);

  const [page, setPage] = useState(1);
  const [sortLabel, setSortLabel] = useState('Most Popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setPage(1), [category]);

  useEffect(() => {
    dispatch(fetchCategoryProducts({ category, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, sortBy, order }));
  }, [dispatch, category, page, sortBy, order]);

  useEffect(() => {
    if (!isTab) navigation.setOptions({ title: titleCase(category) });
  }, [navigation, isTab, category]);

  const visible = items.filter((p) => p.price >= priceMin && p.price <= priceMax);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const listHeader = (
    <View style={{ paddingTop: 16, paddingBottom: 16, gap: 12 }}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{titleCase(category)}</Text>
        <Pressable style={styles.filterBtn} onPress={() => setFiltersOpen(true)}>
          <Ionicons name="options-outline" size={18} />
          <Text style={{ fontWeight: '600' }}>Filters</Text>
        </Pressable>
      </View>
      <Text style={{ color: colors.muted, fontSize: 13 }}>
        Showing {from}-{to} of {total} Products
      </Text>
      <FlatList
        horizontal
        data={SORT_OPTIONS}
        keyExtractor={(o) => o}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => {
          const active = item === sortLabel;
          return (
            <Pressable
              onPress={() => {
                setSortLabel(item);
                dispatch(setSort(item));
              }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && { color: colors.white }]}>{item}</Text>
            </Pressable>
          );
        }}
      />
      {status === 'loading' && <ActivityIndicator style={{ marginTop: 12 }} />}
    </View>
  );

  const listFooter = (
    <View>
      {status === 'succeeded' && visible.length === 0 && (
        <Text style={styles.empty}>No products match these filters.</Text>
      )}
      <View style={styles.pager}>
        <Pressable disabled={page === 1} onPress={() => setPage((p) => Math.max(1, p - 1))} style={[styles.pageBtn, page === 1 && { opacity: 0.3 }]}>
          <Text style={styles.pageBtnText}>← Previous</Text>
        </Pressable>
        <Text style={{ color: colors.muted }}>
          {page} / {totalPages}
        </Text>
        <Pressable disabled={page === totalPages} onPress={() => setPage((p) => Math.min(totalPages, p + 1))} style={[styles.pageBtn, page === totalPages && { opacity: 0.3 }]}>
          <Text style={styles.pageBtnText}>Next →</Text>
        </Pressable>
      </View>
      <View style={{ height: 24 }} />
      <Newsletter />
      <Footer />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={isTab ? ['top'] : []}>
      {isTab && <Header />}
      <FlatList
        data={status === 'loading' ? [] : visible}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24 }}
        ListHeaderComponent={<View style={{ paddingHorizontal: 16 }}>{listHeader}</View>}
        ListFooterComponent={listFooter}
        renderItem={({ item }) => <ProductCard product={item} width={cardWidth} />}
      />
      <FilterModal visible={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...type.h2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  chip: { backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  chipActive: { backgroundColor: colors.black },
  chipText: { fontSize: 13, color: colors.muted },
  empty: { textAlign: 'center', color: colors.muted, marginVertical: 30 },
  pager: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 },
  pageBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  pageBtnText: { fontWeight: '600', fontSize: 13 },
});
