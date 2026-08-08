import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Modal, TouchableOpacity,
  Image, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../utils/theme';
import { PrimaryButton, SecondaryButton } from './UI';

export default function CloseCallModal({ visible, call, onClose, onConfirm }) {
  const [photo, setPhoto] = useState(null);
  const [closeNote, setCloseNote] = useState('');
  const [picking, setPicking] = useState(false);

  async function openCamera() {
    setPicking(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Please allow camera access in Settings to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.75,
        base64: false,
        allowsEditing: false,
      });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch (e) {
      Alert.alert('Error', 'Could not open camera.');
    } finally {
      setPicking(false);
    }
  }

  async function openGallery() {
    setPicking(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Gallery Permission', 'Please allow photo library access in Settings.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.75,
        base64: false,
      });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch (e) {
      Alert.alert('Error', 'Could not open photo library.');
    } finally {
      setPicking(false);
    }
  }

  function handleClose() {
    setPhoto(null);
    setCloseNote('');
    onClose();
  }

  function handleConfirm() {
    if (!photo) return;
    onConfirm(photo, closeNote.trim());
    setPhoto(null);
    setCloseNote('');
  }

  if (!call) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Close Call</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={18} color={colors.gray600} />
            </TouchableOpacity>
          </View>

          <View style={styles.callSummary}>
            <Text style={styles.callSummaryTitle} numberOfLines={1}>{call.title}</Text>
            {!!call.location && (
              <View style={styles.summaryRow}>
                <Ionicons name="location-outline" size={12} color={colors.gray400} />
                <Text style={styles.summaryText}>{call.location}</Text>
              </View>
            )}
          </View>

          <Text style={styles.label}>PROOF OF COMPLETION</Text>
          {photo ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: photo }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.changePhotoBtn} onPress={() => setPhoto(null)}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBtn} onPress={openCamera} disabled={picking} activeOpacity={0.8}>
                {picking ? (
                  <ActivityIndicator color={colors.teal} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={22} color={colors.teal} />
                    <Text style={styles.pickerBtnText}>Take Photo</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerBtn} onPress={openGallery} disabled={picking} activeOpacity={0.8}>
                <Ionicons name="images-outline" size={22} color={colors.teal} />
                <Text style={styles.pickerBtnText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
          {!photo && <Text style={styles.requiredNote}>A photo is required to close this call</Text>}

          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.label}>COMPLETION NOTES (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe what was done…"
              placeholderTextColor={colors.gray400}
              value={closeNote}
              onChangeText={setCloseNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <PrimaryButton
            title="✓  Mark as Complete"
            onPress={handleConfirm}
            disabled={!photo}
          />
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
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.xl,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.gray800, letterSpacing: -0.4 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  callSummary: {
    backgroundColor: colors.gray100,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: 4,
  },
  callSummaryTitle: { fontSize: 14, fontWeight: '700', color: colors.gray800 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summaryText: { fontSize: 12, color: colors.gray600 },
  label: { fontSize: 11, fontWeight: '700', color: colors.gray600, letterSpacing: 0.4, marginBottom: 8 },
  pickerRow: { flexDirection: 'row', gap: spacing.md },
  pickerBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.tealFaint,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.tealFaint,
  },
  pickerBtnText: { fontSize: 12, fontWeight: '700', color: colors.tealDark, textAlign: 'center' },
  photoWrap: { alignItems: 'center', gap: spacing.sm },
  photoPreview: {
    width: '100%', height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.gray100,
  },
  changePhotoBtn: { paddingVertical: 6 },
  changePhotoText: { color: colors.teal, fontSize: 13, fontWeight: '700' },
  requiredNote: { fontSize: 12, color: colors.amber, marginTop: 8, fontWeight: '600' },
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
  textarea: { minHeight: 80, paddingTop: 13 },
});
