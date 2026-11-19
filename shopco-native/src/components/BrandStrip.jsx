import { View, Image, StyleSheet } from 'react-native';
import { logos } from '../assets';
import { colors } from '../theme';

// [source, width, height] — sized to keep each logo's natural aspect ratio.
const BRANDS = [
  { name: 'Versace', src: logos.versace, w: 92, h: 19 },
  { name: 'Zara', src: logos.zara, w: 50, h: 21 },
  { name: 'Gucci', src: logos.gucci, w: 84, h: 19 },
  { name: 'Prada', src: logos.prada, w: 100, h: 17 },
  { name: 'Calvin Klein', src: logos.calvinKlein, w: 104, h: 17 },
];

export default function BrandStrip() {
  return (
    <View style={styles.strip}>
      {BRANDS.map((b) => (
        <Image key={b.name} source={b.src} style={{ width: b.w, height: b.h }} resizeMode="contain" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: colors.black,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    rowGap: 18,
    columnGap: 16,
  },
});
