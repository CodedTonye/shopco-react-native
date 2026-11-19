import { View, Text, Image, StyleSheet } from 'react-native';
import { logos } from '../assets';
import { colors } from '../theme';

const COLUMNS = [
  { title: 'COMPANY', links: ['About', 'Features', 'Works', 'Career'] },
  { title: 'HELP', links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'] },
  { title: 'FAQ', links: ['Account', 'Manage Deliveries', 'Orders', 'Payments'] },
  { title: 'RESOURCES', links: ['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'] },
];

const SOCIALS = [
  { name: 'Twitter', src: logos.twitter },
  { name: 'Facebook', src: logos.facebook },
  { name: 'Instagram', src: logos.instagram },
  { name: 'Github', src: logos.github },
];

const PAYMENTS = [
  { name: 'Visa', src: logos.visa },
  { name: 'Mastercard', src: logos.mastercard },
  { name: 'PayPal', src: logos.paypal },
  { name: 'Apple Pay', src: logos.applepay },
  { name: 'Google Pay', src: logos.googlepay },
];

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Image source={logos.shopco} style={styles.logo} resizeMode="contain" />
      <Text style={styles.blurb}>
        We have clothes that suit your style and which you're proud to wear. From women to men.
      </Text>
      <View style={styles.socials}>
        {SOCIALS.map((s) => (
          <Image key={s.name} source={s.src} style={styles.social} />
        ))}
      </View>

      <View style={styles.columns}>
        {COLUMNS.map((c) => (
          <View key={c.title} style={styles.column}>
            <Text style={styles.colTitle}>{c.title}</Text>
            {c.links.map((l) => (
              <Text key={l} style={styles.link}>
                {l}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copy}>Shop.co © 2000-2023, All Rights Reserved</Text>
        <View style={styles.payments}>
          {PAYMENTS.map((p) => (
            <View key={p.name} style={styles.payment}>
              <Image source={p.src} style={styles.paymentImg} resizeMode="contain" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: colors.cream, marginTop: -40, paddingTop: 72, paddingHorizontal: 20, paddingBottom: 28 },
  logo: { width: 120, height: 22, alignSelf: 'flex-start' },
  blurb: { marginTop: 12, color: colors.muted, fontSize: 13, lineHeight: 19, maxWidth: 280 },
  socials: { flexDirection: 'row', gap: 10, marginTop: 16 },
  social: { width: 30, height: 30 },
  columns: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 28, rowGap: 24 },
  column: { width: '50%', gap: 10 },
  colTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  link: { color: colors.muted, fontSize: 13 },
  bottom: { marginTop: 28, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 18, gap: 14 },
  copy: { color: colors.muted, fontSize: 12 },
  payments: { flexDirection: 'row', gap: 8 },
  payment: {
    width: 46,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentImg: { width: 34, height: 22 },
});
