import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../utils/theme';
import { StatusPill } from './UI';
import { formatDateTime } from '../utils/storage';

export default function CallCard({ call, onClose, onDelete, onViewPhoto }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{call.title}</Text>
          {!!call.location && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={colors.gray400} />
              <Text style={styles.metaText} numberOfLines={1}>{call.location}</Text>
            </View>
          )}
        </View>
        <StatusPill status={call.status} />
      </View>

      {!!call.reporter && (
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={13} color={colors.gray400} />
          <Text style={styles.metaText}>{call.reporter}</Text>
        </View>
      )}

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={13} color={colors.gray400} />
        <Text style={styles.metaText}>Opened {formatDateTime(call.createdAt)}</Text>
      </View>

      {!!call.notes && <Text style={styles.notes} numberOfLines={2}>{call.notes}</Text>}

      {call.status === 'closed' && (
        <View style={styles.closedBlock}>
          <View style={styles.metaRow}>
            <Ionicons name="checkmark-circle-outline" size={13} color={colors.green} />
            <Text style={[styles.metaText, { color: colors.green }]}>
              Closed {formatDateTime(call.closedAt)}
            </Text>
          </View>
          {!!call.closeNote && <Text style={styles.notes} numberOfLines={2}>{call.closeNote}</Text>}
          {!!call.photo && (
            <TouchableOpacity onPress={() => onViewPhoto && onViewPhoto(call.photo)} activeOpacity={0.8}>
              <Image source={{ uri: call.photo }} style={styles.thumb} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.actions}>
        {call.status === 'open' && (
          <TouchableOpacity style={styles.closeBtn} onPress={() => onClose && onClose(call.id)} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={15} color={colors.white} />
            <Text style={styles.closeBtnText}>Close with Photo</Text>
          </TouchableOpacity>
        )}
        {onDelete && call.status === 'closed' && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(call.id)} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '700', color: colors.gray800 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: 12, color: colors.gray600 },
  notes: { fontSize: 13, color: colors.gray700, marginTop: spacing.sm, lineHeight: 18 },
  closedBlock: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    gap: 6,
  },
  thumb: {
    width: '100%', height: 140,
    borderRadius: radius.sm,
    marginTop: 4,
    backgroundColor: colors.gray100,
  },
  actions: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.md, gap: spacing.sm,
  },
  closeBtn: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.teal,
    borderRadius: radius.sm,
    paddingVertical: 11,
  },
  closeBtnText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  deleteBtn: {
    width: 38, height: 38, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gray100,
  },
});
