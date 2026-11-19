import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, useWindowDimensions, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchSearchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import { colors } from '../theme';

export default function SearchScreen() {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32 - 14) / 2;
  const { items, total, status, query } = useSelector((s) => s.products.search);
  const [text, setText] = useState('');

  // Debounced search-as-you-type
  useEffect(() => {
    if (!text.trim()) return;
    const t = setTimeout(() => dispatch(fetchSearchProducts({ q: text.trim(), limit: 20 })), 350);
    return () => clearTimeout(t);
  }, [text, dispatch]);

  const hasQuery = text.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.bar}>
        <Ionicons name="search-outline" size={18} color={colors.faint} />
        <TextInput
          autoFocus
          value={text}
          onChangeText={setText}
          placeholder="Search for products..."
          placeholderTextColor={colors.faint}
          returnKeyType="search"
          style={styles.input}
        />
        {hasQuery && (
          <Pressable onPress={() => setText('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.faint} />
          </Pressable>
        )}
      </View>

      {!hasQuery && <Text style={styles.hint}>Try "shirt", "shoes" or "bag".</Text>}
      {hasQuery && status === 'loading' && <ActivityIndicator style={{ marginTop: 30 }} />}
      {hasQuery && status === 'succeeded' && (
        <FlatList
          data={items}
          keyExtractor={(p) => String(p.id)}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24 }}
          ListHeaderComponent={
            <Text style={styles.count}>
              {total} {total === 1 ? 'product' : 'products'} found for "{query}"
            </Text>
          }
          ListEmptyComponent={<Text style={styles.hint}>No products matched "{query}".</Text>}
          renderItem={({ item }) => <ProductCard product={item} width={cardWidth} />}
        />
      )}
      {hasQuery && status === 'failed' && <Text style={[styles.hint, { color: colors.red }]}>Something went wrong. Please try again.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.grey, borderRadius: 999, margin: 16, paddingHorizontal: 16 },
  input: { flex: 1, paddingVertical: 13, fontSize: 15 },
  hint: { textAlign: 'center', color: colors.muted, marginTop: 30, paddingHorizontal: 24 },
  count: { color: colors.muted, fontSize: 13, paddingHorizontal: 16, marginBottom: 16 },
});
