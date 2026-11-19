import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function StarRating({ rating = 0, size = 14, showValue = true, textSize = 13 }) {
  const full = Math.round(rating);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ flexDirection: 'row', gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons key={i} name={i < full ? 'star' : 'star-outline'} size={size} color={colors.star} />
        ))}
      </View>
      {showValue && (
        <Text style={{ fontSize: textSize, color: colors.muted }}>{rating.toFixed(1)}/5</Text>
      )}
    </View>
  );
}
