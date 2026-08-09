import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Image, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../utils/theme';
import CallCard from '../components/CallCard';
import NewCallModal from '../components/NewCallModal';
import CloseCallModal from '../components/CloseCallModal';
import { EmptyState, SectionHeader } from '../components/UI';
import { genId } from '../utils/storage';

export default function ActiveCallsScreen({ calls, onUpdateCalls }) {
  const [showNew, setShowNew] = useState(false);
  const [closingCallId, setClosingCallId] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const openCalls = calls.filter(c => c.status === 'open');
  const closedCalls = calls.filter(c => c.status === 'closed');
  const closingCall = calls.find(c => c.id === closingCallId);

  function handleCreate(data) {
    const newCall = {
      ...data,
      id: genId(),
      status: 'open',
      createdAt: new Date().toISOString(),
      closedAt: null,
      photo: null,
      closeNote: null,
    };
    onUpdateCalls([newCall, ...calls]);
    setShowNew(false);
  }

  function handleConfirmClose(photo, closeNote) {
    onUpdateCalls(calls.map(c =>
      c.id === closingCallId
        ? { ...c, status: 'closed', closedAt: new Date().toISOString(), photo, closeNote }
        : c
    ));
    setClosingCallId(null);
  }

  function handleDelete(id) {
    Alert.alert('Delete Record', 'Remove this call from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onUpdateCalls(calls.filter(c => c.id !== id)) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        {/* Open Calls */}
        <SectionHeader
          title="Open Calls"
          badge={openCalls.length > 0 ? `${openCalls.length} pending` : undefined}
          badgeStyle="amber"
        />
        {openCalls.length === 0 ? (
          <EmptyState icon="🧹" title="No open calls" message="All clear! Tap + to open a new call." />
        ) : (
          openCalls.map(call => (
            <CallCard
              key={call.id}
              call={call}
              onClose={setClosingCallId}
              onDelete={handleDelete}
              onViewPhoto={setLightbox}
            />
          ))
        )}

        {/* Recently Closed */}
        {closedCalls.length > 0 && (
          <>
            <SectionHeader title="Recently Closed" />
            {closedCalls.slice(0, 5).map(call => (
              <CallCard
                key={call.id}
                call={call}
                onDelete={handleDelete}
                onViewPhoto={setLightbox}
              />
            ))}
          </>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowNew(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      {/* New call modal */}
      <NewCallModal
        visible={showNew}
        onClose={() => setShowNew(false)}
        onCreate={handleCreate}
      />

      {/* Close call modal */}
      <CloseCallModal
        visible={!!closingCallId}
        call={closingCall}
        onClose={() => setClosingCallId(null)}
        onConfirm={handleConfirmClose}
      />

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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
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
