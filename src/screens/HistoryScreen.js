import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Header from '../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Api from '../utils/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const zeroToDash = value => {
  if (value === 0 || value === null || value === undefined) return '-';
  return value;
};

const rupiahOrDash = value => {
  if (!value || value === 0) return '-';
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const menitOrDash = value => {
  if (!value || value === 0) return '-';
  return `${value} menit`;
};

const HistoryScreen = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [absensiHarian, setAbsensiHarian] = useState(null);

  const formatDate = date =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const formatTanggalDDMMYYYY = date => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    primary: '#8B1E1E',
    success: '#4CAF50',
    warning: '#FB8C00',
    iconPrimary: isDark ? '#ffffffff' : '#D32F2F',
  };
  // console.log('REQUEST:', {
  //   id_karyawan,
  //   tanggal,
  // });

  const fetchAbsensiHarian = async date => {
    try {
      setLoading(true);

      const id_karyawan = await AsyncStorage.getItem('id_karyawan');
      if (!id_karyawan) return;

      const tanggal = formatTanggalDDMMYYYY(date);

      const response = await Api.get(
        `/perhitungan-gaji/harian?id_karyawan=${id_karyawan}&tanggal=${tanggal}`,
      );

      setAbsensiHarian(response.data.data);
    } catch (error) {
      console.log(
        'Error fetch absensi harian:',
        error.response?.data || error.message,
      );
      setAbsensiHarian(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensiHarian(selectedDate);
  }, []);

  const renderItem = (label, value, color) => (
    <View style={styles.itemRow}>
      <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.itemValue, { color: color || theme.textPrimary }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <>
      <Header
        title="History"
        showBack={false}
        showGreeting={false}
        showNotification
        showProfileInitial
      />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* ===== ABSENSI HARIAN ===== */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* HEADER CARD */}
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              Absensi Harian
            </Text>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={theme.iconPrimary}
              />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* DATE PICKER */}
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  setSelectedDate(date);
                  fetchAbsensiHarian(date);
                }
              }}
            />
          )}

          {loading ? (
            <Text style={{ color: theme.textSecondary }}>Memuat data...</Text>
          ) : absensiHarian ? (
            <>
              {renderItem(
                'Gaji Harian',
                rupiahOrDash(absensiHarian.gaji_harian),
              )}

              {renderItem('Jam Masuk', absensiHarian.jam_masuk ?? '-')}

              {renderItem('Jam Keluar', absensiHarian.jam_keluar ?? '-')}

              {renderItem(
                'Jam Terlambat',
                menitOrDash(absensiHarian.jam_terlambat),
                absensiHarian.jam_terlambat > 0
                  ? theme.warning
                  : theme.textSecondary,
              )}

              {renderItem(
                'Jam Kurang',
                menitOrDash(absensiHarian.jam_kurang),
                absensiHarian.jam_kurang > 0
                  ? theme.warning
                  : theme.textSecondary,
              )}

              {renderItem(
                'Total Jam Kerja',
                menitOrDash(absensiHarian.total_jam_kerja),
              )}

              {renderItem(
                'Tunjangan Kehadiran',
                rupiahOrDash(absensiHarian.tunjangan_kehadiran),
              )}

              {renderItem(
                'Upah Bersih',
                rupiahOrDash(absensiHarian.upah_bersih),
                theme.primary,
              )}
            </>
          ) : (
            <Text style={{ color: theme.textSecondary }}>
              Data absensi tidak tersedia
            </Text>
          )}
        </View>

        {/* ===== MENU REKAPAN ===== */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Rekapan
        </Text>

        <TouchableOpacity
          style={[styles.menuRow, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('RekapAbsensi')}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={theme.iconPrimary}
          />
          <Text style={[styles.menuText, { color: theme.textPrimary }]}>
            Rekapan Absensi
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('RekapIzinSakit')}
        >
          <Ionicons name="medkit-outline" size={22} color={theme.iconPrimary} />
          <Text style={[styles.menuText, { color: theme.textPrimary }]}>
            Rekapan Izin / Sakit
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('RekapLembur')}
        >
          <Ionicons
            name="hourglass-outline"
            size={22}
            color={theme.iconPrimary}
          />
          <Text style={[styles.menuText, { color: theme.textPrimary }]}>
            Rekapan Lembur
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  itemLabel: {
    fontSize: 13,
  },

  itemValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },

  /* MENU */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },

  dateText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
