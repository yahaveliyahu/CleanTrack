import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { colors, radius, typography, spacing } from '../utils/theme';

// ─── Status Pill ──────────────────────────────────────────────────────────────
export function StatusPill({ status }) {
  const isOpen = status === 'open';
  return (
    <View style={[styles.pill, isOpen ? styles.pillAmber : styles.pillGreen]}>
      <Text style={[styles.pillText, isOpen ? styles.pillTextAmber : styles.pillTextGreen]}>
        {isOpen ? 'OPEN' : 'CLOSED'}
      </Text>
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ number, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNum, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Filter Chip ─────────────────────────────────────────────────────────────
export function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, badge, badgeStyle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {badge !== undefined && (
        <View style={[styles.badge, badgeStyle === 'amber' ? styles.badgeAmber : styles.badgeTeal]}>
          <Text style={[styles.badgeText, badgeStyle === 'amber' ? styles.badgeTextAmber : styles.badgeTextTeal]}>
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, message }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>{icon}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
export function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Secondary Button ─────────────────────────────────────────────────────────
export function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.secondaryBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.secondaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pillAmber: { backgroundColor: colors.amberFaint },
  pillGreen: { backgroundColor: colors.greenFaint },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  pillTextAmber: { color: colors.amber },
  pillTextGreen: { color: colors.green },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: colors.gray600, marginTop: 2, fontWeight: '600' },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.navy },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.gray600 },
  chipTextActive: { color: colors.white },

  sectionHeader: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.sm, marginTop: spacing.sm,
  },
  sectionTitle: { ...typography.h3, color: colors.gray800, textAlign: 'left' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  badgeAmber: { backgroundColor: colors.amberFaint },
  badgeTeal: { backgroundColor: colors.tealFaint },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextAmber: { color: colors.amber },
  badgeTextTeal: { color: colors.tealDark },

  empty: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.xxl * 1.5,
    gap: 6,
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyEmoji: { fontSize: 28 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.gray800 },
  emptyMessage: { fontSize: 13, color: colors.gray400, textAlign: 'center', paddingHorizontal: 32 },

  primaryBtn: {
    backgroundColor: colors.teal,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryBtnDisabled: { backgroundColor: colors.gray200 },
  primaryBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  primaryBtnTextDisabled: { color: colors.gray400 },

  secondaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { color: colors.gray600, fontSize: 14, fontWeight: '600' },
});
