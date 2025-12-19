import React, { useState } from 'react';
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

const HistoryScreen = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = date =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    primary: '#8B1E1E',
    success: '#4CAF50',
    warning: '#FB8C00',
  };

  /* ===== DATA HARDCODE SEMENTARA ===== */
  const absensiHarian = {
    gaji_harian: 'Rp 100.000',
    jam_masuk: '08:10',
    jam_keluar: '17:00',
    lokasi_masuk: 'Kantor Pusat',
    lokasi_keluar: 'Kantor Pusat',
    jam_terlambat: '00:10',
    jam_bolos: '00:00',
    total_jam_kerja: '08:50',
    tunjangan_kehadiran: 'Rp 20.000',
    upah_bersih: 'Rp 120.000',
  };

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
      <Header title="History" showBack={false} />

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
                color={theme.primary}
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
                  // nanti di sini fetch API berdasarkan tanggal
                }
              }}
            />
          )}

          {/* DATA HARDCODE */}
          {renderItem('Gaji Harian', absensiHarian.gaji_harian)}
          {renderItem('Jam Masuk', absensiHarian.jam_masuk)}
          {renderItem('Jam Keluar', absensiHarian.jam_keluar)}
          {renderItem('Lokasi Masuk', absensiHarian.lokasi_masuk)}
          {renderItem('Lokasi Keluar', absensiHarian.lokasi_keluar)}
          {renderItem(
            'Jam Terlambat',
            absensiHarian.jam_terlambat,
            theme.warning,
          )}
          {renderItem('Jam Bolos', absensiHarian.jam_bolos, theme.success)}
          {renderItem('Total Jam Kerja', absensiHarian.total_jam_kerja)}
          {renderItem('Tunjangan Kehadiran', absensiHarian.tunjangan_kehadiran)}
          {renderItem('Upah Bersih', absensiHarian.upah_bersih, theme.primary)}
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
            color={theme.primary}
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
          <Ionicons name="medkit-outline" size={22} color={theme.primary} />
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
          <Ionicons name="time-outline" size={22} color={theme.primary} />
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
