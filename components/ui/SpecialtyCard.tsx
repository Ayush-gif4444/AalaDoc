import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SpecialtyItem } from '@/src/data/doctors';
import { Colors } from './colors';

interface SpecialtyCardProps {
  specialty: SpecialtyItem;
  isSelected?: boolean;
  onPress: () => void;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: specialty.bg },
          isSelected && styles.selectedBox,
        ]}
      >
        <MaterialCommunityIcons
          name={specialty.iconName as any}
          size={28}
          color={specialty.iconColor}
        />
      </View>
      <Text
        numberOfLines={2}
        style={[styles.label, isSelected && styles.selectedLabel]}
      >
        {specialty.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 66,
    marginRight: 10,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },
  selectedLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
