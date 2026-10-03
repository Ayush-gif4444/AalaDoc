import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './colors';
import { SPECIALTIES } from '@/src/data/doctors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  minExperience: number;
  onSelectMinExperience: (exp: number) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedSpecialty,
  onSelectSpecialty,
  minExperience,
  onSelectMinExperience,
  onReset,
}) => {
  const [tempSpecialty, setTempSpecialty] = useState(selectedSpecialty);
  const [tempExp, setTempExp] = useState(minExperience);

  const handleApply = () => {
    onSelectSpecialty(tempSpecialty);
    onSelectMinExperience(tempExp);
    onClose();
  };

  const handleReset = () => {
    setTempSpecialty('all');
    setTempExp(0);
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Doctors</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Specialty */}
            <Text style={styles.sectionTitle}>Specialty</Text>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  tempSpecialty === 'all' && styles.activeChip,
                ]}
                onPress={() => setTempSpecialty('all')}
              >
                <Text
                  style={[
                    styles.chipText,
                    tempSpecialty === 'all' && styles.activeChipText,
                  ]}
                >
                  All Specialties
                </Text>
              </TouchableOpacity>
              {SPECIALTIES.map((spec) => (
                <TouchableOpacity
                  key={spec.id}
                  style={[
                    styles.chip,
                    tempSpecialty === spec.id && styles.activeChip,
                  ]}
                  onPress={() => setTempSpecialty(spec.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tempSpecialty === spec.id && styles.activeChipText,
                    ]}
                  >
                    {spec.name.replace('\n', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Experience */}
            <Text style={styles.sectionTitle}>Minimum Experience</Text>
            <View style={styles.chipsRow}>
              {[
                { label: 'Any', value: 0 },
                { label: '5+ Years', value: 5 },
                { label: '7+ Years', value: 7 },
                { label: '10+ Years', value: 10 },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.chip,
                    tempExp === item.value && styles.activeChip,
                  ]}
                  onPress={() => setTempExp(item.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tempExp === item.value && styles.activeChipText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
