import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Modal, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../utils/theme';
import { PrimaryButton, SecondaryButton } from './UI';

const initialState = { title: '', location: '', reporter: '', notes: '' };

export default function NewCallModal({ visible, onClose, onCreate }) {
  const [form, setForm] = useState(initialState);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(initialState);
    onClose();
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.location.trim() || !form.reporter.trim()) return;
    onCreate({
      title: form.title.trim(),
      location: form.location.trim(),
      reporter: form.reporter.trim(),
      notes: form.notes.trim(),
    });
    setForm(initialState);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>New Call</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={18} color={colors.gray600} />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Spill in lobby, restroom restock…"
              placeholderTextColor={colors.gray400}
              value={form.title}
              onChangeText={v => update('title', v)}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>LOCATION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2nd floor, Building B"
              placeholderTextColor={colors.gray400}
              value={form.location}
              onChangeText={v => update('location', v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>REPORTED BY</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.gray400}
              value={form.reporter}
              onChangeText={v => update('reporter', v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>NOTES (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Anything the next person should know…"
              placeholderTextColor={colors.gray400}
              value={form.notes}
              onChangeText={v => update('notes', v)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <PrimaryButton title="Open Call" onPress={handleSubmit} disabled={!form.title.trim() || !form.location.trim() || !form.reporter.trim()} />
          <SecondaryButton title="Cancel" onPress={handleClose} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, padding: spacing.xl },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.gray200,
    alignSelf: 'center', marginBottom: spacing.xl,
  },
  header: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.xl,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.gray800, letterSpacing: -0.4 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  field: { marginBottom: spacing.lg },
  label: { fontSize: 11, fontWeight: '700', color: colors.gray600, letterSpacing: 0.4, marginBottom: 6 },
  input: {
    backgroundColor: colors.gray50,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.gray800,
  },
  textarea: { minHeight: 90, paddingTop: 13 },
});
