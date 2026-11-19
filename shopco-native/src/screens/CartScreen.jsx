import { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  removeFromCart, incrementQty, decrementQty, applyPromo,
  selectCartItems, selectSubtotal, selectDiscount, selectDeliveryFee, selectTotal,
} from '../store/cartSlice';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { colors, type } from '../theme';

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const deliveryFee = useSelector(selectDeliveryFee);
  const total = useSelector(selectTotal);
  const promoApplied = useSelector((s) => s.cart.promoApplied);
  const [promo, setPromo] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>YOUR CART</Text>

          {items.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 60, gap: 16 }}>
              <Ionicons name="cart-outline" size={56} color={colors.faint} />
              <Text style={{ color: colors.muted }}>Your cart is empty.</Text>
              <Pressable style={styles.darkBtn} onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.darkBtnText}>Continue Shopping</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                {items.map((item, i) => (
                  <View key={item.cartId} style={[styles.item, i > 0 && styles.itemBorder]}>
                    <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '700', fontSize: 16, flex: 1 }} numberOfLines={2}>{item.title}</Text>
                        <Pressable onPress={() => dispatch(removeFromCart(item.cartId))} hitSlop={10}>
                          <Ionicons name="trash-outline" size={20} color={colors.red} />
                        </Pressable>
                      </View>
                      <Text style={styles.meta}>Size: {item.size}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.meta}>Color:</Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, borderWidth: 1, borderColor: colors.border }} />
                      </View>
                      <View style={styles.itemBottom}>
                        <Text style={{ fontSize: 20, fontWeight: '800' }}>${item.price.toFixed(0)}</Text>
                        <View style={styles.qty}>
                          <Pressable onPress={() => dispatch(decrementQty(item.cartId))} hitSlop={8}>
                            <Text style={styles.qtyBtn}>−</Text>
                          </Pressable>
                          <Text style={{ fontWeight: '600' }}>{item.qty}</Text>
                          <Pressable onPress={() => dispatch(incrementQty(item.cartId))} hitSlop={8}>
                            <Text style={styles.qtyBtn}>+</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={[styles.card, { marginTop: 16, padding: 20 }]}>
                <Text style={{ fontSize: 20, fontWeight: '700' }}>Order Summary</Text>
                <View style={styles.line}><Text style={styles.lineLabel}>Subtotal</Text><Text style={styles.lineValue}>${subtotal.toFixed(0)}</Text></View>
                <View style={styles.line}><Text style={styles.lineLabel}>Discount (-20%)</Text><Text style={[styles.lineValue, { color: colors.red }]}>-${discount.toFixed(0)}</Text></View>
                <View style={styles.line}><Text style={styles.lineLabel}>Delivery Fee</Text><Text style={styles.lineValue}>${deliveryFee.toFixed(0)}</Text></View>
                <View style={styles.rule} />
                <View style={styles.line}><Text style={{ fontSize: 18 }}>Total</Text><Text style={{ fontSize: 22, fontWeight: '800' }}>${total.toFixed(0)}</Text></View>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                  <View style={styles.promo}>
                    <Ionicons name="pricetag-outline" size={16} color={colors.faint} />
                    <TextInput value={promo} onChangeText={setPromo} placeholder="Add promo code" placeholderTextColor={colors.faint} style={{ flex: 1, paddingVertical: 12 }} />
                  </View>
                  <Pressable style={[styles.darkBtn, { paddingHorizontal: 22 }]} onPress={() => promo.trim() && dispatch(applyPromo())}>
                    <Text style={styles.darkBtnText}>{promoApplied ? 'Applied ✓' : 'Apply'}</Text>
                  </Pressable>
                </View>

                <Pressable style={[styles.darkBtn, { marginTop: 16 }]} onPress={() => Alert.alert('Checkout', 'Checkout is not implemented in this demo.')}>
                  <Text style={styles.darkBtnText}>Go to Checkout →</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
        <View style={{ height: 24 }} />
        <Newsletter />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { ...type.h2, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 14 },
  item: { flexDirection: 'row', gap: 14, paddingVertical: 12 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  thumb: { width: 96, height: 96, borderRadius: 12, backgroundColor: colors.cream },
  meta: { fontSize: 13, color: colors.muted, marginTop: 3 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  qtyBtn: { fontSize: 18, lineHeight: 20 },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  lineLabel: { fontSize: 16, color: colors.muted },
  lineValue: { fontSize: 16, fontWeight: '700' },
  rule: { height: 1, backgroundColor: colors.border, marginTop: 16 },
  promo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.grey, borderRadius: 999, paddingHorizontal: 14 },
  darkBtn: { backgroundColor: colors.black, borderRadius: 999, paddingVertical: 15, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  darkBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
