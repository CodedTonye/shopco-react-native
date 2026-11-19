import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { setPriceRange, toggleColor, toggleSize, resetFilters } from '../store/filtersSlice';
import { DRESS_STYLE_CATEGORY_MAP } from '../store/productsSlice';
import { colors } from '../theme';

const PRICE_RANGES = [
  { label: 'Any', min: 0, max: 100000 },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 – $50', min: 25, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: 100000 },
];
const SWATCHES = ['#22c55e', '#ef4444', '#eab308', '#f97316', '#38bdf8', '#2563eb', '#7c3aed', '#ec4899', '#ffffff', '#000000'];
const SIZES = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
const DRESS_STYLES = ['Casual', 'Formal', 'Party', 'Gym'];

export default function FilterModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const filters = useSelector((s) => s.filters);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
            <Text style={styles.section}>Price</Text>
            <View style={styles.wrap}>
              {PRICE_RANGES.map((r) => {
                const active = filters.priceMin === r.min && filters.priceMax === r.max;
                return (
                  <Pressable
                    key={r.label}
                    onPress={() => dispatch(setPriceRange({ min: r.min, max: r.max }))}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.section}>Colors</Text>
            <View style={styles.wrap}>
              {SWATCHES.map((c) => {
                const active = filters.colors.includes(c);
                return (
                  <Pressable
                    key={c}
                    onPress={() => dispatch(toggleColor(c))}
                    style={[styles.swatch, { backgroundColor: c }, active && styles.swatchActive]}
                  >
                    {active && <Ionicons name="checkmark" size={16} color={c === '#ffffff' ? '#000' : '#fff'} />}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.section}>Size</Text>
            <View style={styles.wrap}>
              {SIZES.map((s) => {
                const active = filters.sizes.includes(s);
                return (
                  <Pressable key={s} onPress={() => dispatch(toggleSize(s))} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.section}>Dress Style</Text>
            {DRESS_STYLES.map((d) => (
              <Pressable
                key={d}
                style={styles.row}
                onPress={() => {
                  onClose();
                  navigation.navigate('Category', { category: DRESS_STYLE_CATEGORY_MAP[d.toLowerCase()] });
                }}
              >
                <Text style={styles.rowText}>{d}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.faint} />
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => dispatch(resetFilters())}>
              <Text style={styles.btnGhostText}>Reset</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnDark]} onPress={onClose}>
              <Text style={styles.btnDarkText}>Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800' },
  section: { fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  chipActive: { backgroundColor: colors.black },
  chipText: { fontSize: 13, color: colors.muted },
  chipTextActive: { color: colors.white },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  swatchActive: { borderWidth: 2, borderColor: colors.black },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowText: { fontSize: 14, color: colors.muted },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnDark: { backgroundColor: colors.black },
  btnDarkText: { color: colors.white, fontWeight: '600' },
  btnGhost: { borderWidth: 1, borderColor: colors.border },
  btnGhostText: { fontWeight: '600' },
});
