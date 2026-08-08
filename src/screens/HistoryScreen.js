import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, StyleSheet,
  TouchableOpacity, Image, Modal, Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../utils/theme';
import { StatCard, FilterChip, EmptyState, StatusPill } from '../components/UI';
import { formatDate, formatTime } from '../utils/storage';

export default function HistoryScreen({ calls, onUpdateCalls }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const totalOpen = calls.filter(c => c.status === 'open').length;
  const totalClosed = calls.filter(c => c.status === 'closed').length;

  const filtered = calls
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q) ||
        (c.reporter || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function confirmDelete(id) {
    Alert.alert('Delete Record', 'Remove this call from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onUpdateCalls(calls.filter(c => c.id !== id)) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsBar}>
          <StatCard number={calls.length} label="Total" color={colors.teal} />
          <StatCard number={totalOpen} label="Open" color={colors.amber} />
          <StatCard number={totalClosed} label="Closed" color={colors.green} />
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={colors.gray400} style={styles.searchIcon} />
          <TextInput
            style={styles.searchBox}
            placeholder="Search title, location, reporter…"
            placeholderTextColor={colors.gray400}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
          {[['all', 'All'], ['open', 'Open'], ['closed', 'Closed']].map(([val, label]) => (
            <FilterChip key={val} label={label} active={filter === val} onPress={() => setFilter(val)} />
          ))}
        </ScrollView>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="No records found" message="Try adjusting your search or filter." />
        ) : (
          <View style={styles.table}>
            {filtered.map(call => (
              <View key={call.id} style={styles.row}>
                <TouchableOpacity
                  style={styles.rowThumb}
                  onPress={() => call.photo && setLightbox(call.photo)}
                  activeOpacity={call.photo ? 0.8 : 1}
                >
                  {call.photo ? (
                    <Image source={{ uri: call.photo }} style={styles.rowThumbImg} />
                  ) : (
                    <View style={styles.rowThumbPlaceholder}>
                      <Ionicons name="image-outline" size={16} color={colors.gray400} />
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.rowBody}>
                  <View style={styles.rowTopLine}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{call.title}</Text>
                    <StatusPill status={call.status} />
                  </View>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    {call.location || '—'}{call.reporter ? `  ·  ${call.reporter}` : ''}
                  </Text>
                  <Text style={styles.rowDate}>
                    {formatDate(call.createdAt)} {formatTime(call.createdAt)}
                  </Text>
                </View>

                <TouchableOpacity style={styles.rowDelete} onPress={() => confirmDelete(call.id)}>
                  <Ionicons name="trash-outline" size={15} color={colors.gray400} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Lightbox */}
      <Modal visible={!!lightbox} transparent animationType="fade" onRequestClose={() => setLightbox(null)}>
        <TouchableOpacity style={styles.lightbox} onPress={() => setLightbox(null)} activeOpacity={1}>
          {lightbox && <Image source={{ uri: lightbox }} style={styles.lightboxImg} resizeMode="contain" />}
          <TouchableOpacity style={styles.lightboxClose} onPress={() => setLightbox(null)}>
            <Ionicons name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray100 },
  content: { flex: 1 },
  contentPad: { padding: spacing.lg },
  statsBar: { flexDirection: 'row', marginHorizontal: -4, marginBottom: spacing.lg },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  searchIcon: { marginRight: 8 },
  searchBox: { flex: 1, paddingVertical: 11, fontSize: 14, color: colors.gray800 },
  clearBtn: { padding: 4 },
  filterBar: { marginBottom: spacing.md },
  filterBarContent: { paddingRight: spacing.lg },
  table: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: spacing.sm,
  },
  rowThumb: { width: 44, height: 44, borderRadius: radius.sm, overflow: 'hidden' },
  rowThumbImg: { width: '100%', height: '100%' },
  rowThumbPlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.gray800 },
  rowMeta: { fontSize: 12, color: colors.gray600 },
  rowDate: { fontSize: 11, color: colors.gray400 },
  rowDelete: { padding: 6 },
  lightbox: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  lightboxImg: { width: '95%', height: '80%' },
  lightboxClose: {
    position: 'absolute', top: 50, right: 20,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
});
