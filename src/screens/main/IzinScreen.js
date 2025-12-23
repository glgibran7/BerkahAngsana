import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import Header from '../../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';

const IzinScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';
  const { showLoading, hideLoading, showToast, user } = useGlobal();

  const [tglMulai, setTglMulai] = useState(null);
  const [tglSelesai, setTglSelesai] = useState(null);
  const [showMulaiPicker, setShowMulaiPicker] = useState(false);
  const [showSelesaiPicker, setShowSelesaiPicker] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [file, setFile] = useState(null);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [riwayat, setRiwayat] = useState([]);

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#9E9E9E' : '#757575',
    border: isDark ? '#333' : '#DDD',
    primary: '#8B1E1E',
  };

  /* ================= UTIL ================= */
  const formatDDMMYYYY = date => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  /* ================= GET RIWAYAT (NO SPINNER) ================= */
  const fetchRiwayat = async () => {
    try {
      const res = await Api.get('/izin/saya');
      const data = res.data?.data || [];

      const filtered = data.filter(
        item => item.id_karyawan === user?.id_karyawan,
      );

      setRiwayat(filtered);
    } catch (err) {
      console.log('ERROR RIWAYAT:', err?.response?.data || err);
      showToast('Gagal', 'Gagal mengambil riwayat izin', 'error');
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  /* ================= CAMERA ================= */
  const openCamera = async () => {
    setShowPickerModal(false);

    const res = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      quality: 0.8,
    });

    if (res.didCancel) return;

    const asset = res.assets?.[0];
    if (!asset) return;

    setFile({
      uri: asset.uri,
      name: asset.fileName || `kamera_${Date.now()}.jpg`,
      type: asset.type || 'image/jpeg',
    });
  };

  /* ================= GALLERY ================= */
  const openGallery = async () => {
    setShowPickerModal(false);

    const res = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 1,
    });

    if (res.didCancel) return;

    const asset = res.assets?.[0];
    if (!asset) return;

    setFile({
      uri: asset.uri,
      name: asset.fileName || 'lampiran',
      type: asset.type || 'application/octet-stream',
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!tglMulai || !tglSelesai) {
      showToast('Validasi', 'Tanggal wajib diisi', 'error');
      return;
    }

    try {
      showLoading();

      const formData = new FormData();
      formData.append('id_jenis', 3); // INTEGER
      formData.append('tgl_mulai', formatDDMMYYYY(tglMulai));
      formData.append('tgl_selesai', formatDDMMYYYY(tglSelesai));
      formData.append('keterangan', keterangan || '-');

      if (file) {
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });
      }

      await Api.post('/perizinan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Berhasil', 'Pengajuan izin berhasil', 'success');

      setTglMulai(null);
      setTglSelesai(null);
      setKeterangan('');
      setFile(null);

      fetchRiwayat();
    } catch (err) {
      console.log('ERROR SUBMIT:', err?.response?.data || err);
      showToast(
        'Gagal',
        err?.response?.data?.message || 'Terjadi kesalahan',
        'error',
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <Header
        title="Pengajuan Izin"
        showBack
        showGreeting={false}
        showProfileInitial={false}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* ================= FORM ================= */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            Tanggal Mulai
          </Text>
          <TouchableOpacity
            style={[styles.input, { borderColor: theme.border }]}
            onPress={() => setShowMulaiPicker(true)}
          >
            <Text style={{ color: theme.textPrimary }}>
              {tglMulai ? formatDDMMYYYY(tglMulai) : 'Pilih tanggal'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={theme.primary} />
          </TouchableOpacity>

          <Text
            style={[styles.label, { color: theme.textPrimary, marginTop: 12 }]}
          >
            Tanggal Selesai
          </Text>
          <TouchableOpacity
            style={[styles.input, { borderColor: theme.border }]}
            onPress={() => setShowSelesaiPicker(true)}
          >
            <Text style={{ color: theme.textPrimary }}>
              {tglSelesai ? formatDDMMYYYY(tglSelesai) : 'Pilih tanggal'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={theme.primary} />
          </TouchableOpacity>

          <Text
            style={[styles.label, { color: theme.textPrimary, marginTop: 12 }]}
          >
            Keterangan
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { borderColor: theme.border, color: theme.textPrimary },
            ]}
            placeholder="Tambahkan keterangan"
            placeholderTextColor={theme.textSecondary}
            multiline
            value={keterangan}
            onChangeText={setKeterangan}
          />

          <Text
            style={[styles.label, { color: theme.textPrimary, marginTop: 12 }]}
          >
            Lampiran
          </Text>
          <TouchableOpacity
            style={[styles.fileBox, { borderColor: theme.border }]}
            onPress={() => setShowPickerModal(true)}
          >
            <Ionicons
              name="attach-outline"
              size={18}
              color={theme.textSecondary}
            />
            <Text style={{ marginLeft: 8, color: theme.textSecondary }}>
              {file?.name || 'Upload file / Foto'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Ajukan Izin</Text>
          </TouchableOpacity>
        </View>

        {/* ================= MENU RIWAYAT ================= */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Riwayat
        </Text>

        <TouchableOpacity
          style={[styles.menuRow, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('RiwayatIzin')}
        >
          <Ionicons name="time-outline" size={22} color={theme.primary} />
          <Text style={[styles.menuText, { color: theme.textPrimary }]}>
            Riwayat Perizinan
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* ================= DATE PICKER ================= */}
      {showMulaiPicker && (
        <DateTimePicker
          value={tglMulai || new Date()}
          mode="date"
          onChange={(e, date) => {
            setShowMulaiPicker(false);
            if (date) setTglMulai(date);
          }}
        />
      )}

      {showSelesaiPicker && (
        <DateTimePicker
          value={tglSelesai || new Date()}
          mode="date"
          onChange={(e, date) => {
            setShowSelesaiPicker(false);
            if (date) setTglSelesai(date);
          }}
        />
      )}

      {/* ================= CUSTOM FILE PICKER ================= */}
      <Modal
        visible={showPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPickerModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.modalItem} onPress={openCamera}>
              <Ionicons name="camera-outline" size={20} color={theme.primary} />
              <Text style={styles.modalText}>Ambil Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem} onPress={openGallery}>
              <Ionicons name="image-outline" size={20} color={theme.primary} />
              <Text style={styles.modalText}>Pilih dari Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalItem, { justifyContent: 'center' }]}
              onPress={() => setShowPickerModal(false)}
            >
              <Text style={[styles.modalText, { color: '#E53935' }]}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default IzinScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, elevation: 2 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 1,
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  modalText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },
});
