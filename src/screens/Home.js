import React from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext';
import Header from '../components/Header';

const getTodayDate = () => {
  const now = new Date();

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return {
    dayName: days[now.getDay()],
    fullDate: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
  };
};

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  const { setUser, showToast } = useGlobal();
  const today = getTodayDate();

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    divider: isDark ? '#2A2A2A' : '#EEEEEE',
    primary: '#8B1E1E',
    success: '#4CAF50',
    info: '#1976D2',
    warning: '#FB8C00',
    danger: '#B71C1C',
  };

  return (
    <>
      <Header showMessage={false} showBack={false} />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* INFO + REKAP*/}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={[styles.shiftText, { color: theme.textPrimary }]}>
                Jam Kerja
              </Text>
              <Text style={[styles.timeText, { color: theme.textPrimary }]}>
                08.00 - 17.00 WITA
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.subText, { color: theme.textSecondary }]}>
                {today.dayName},
              </Text>
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                {today.fullDate}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <Text style={[styles.rekapTitle, { color: theme.textPrimary }]}>
            Rekap Absensi{' '}
            {`(${new Date().toLocaleString('id-ID', { month: 'long' })})`}
          </Text>

          <View style={styles.rekapRow}>
            <View style={styles.rekapItem}>
              <Text style={[styles.rekapValue, { color: theme.success }]}>
                8 Hari
              </Text>
              <Text style={[styles.rekapLabel, { color: theme.textSecondary }]}>
                Hadir
              </Text>
            </View>

            <View style={styles.rekapItem}>
              <Text style={[styles.rekapValue, { color: theme.warning }]}>
                1 Hari
              </Text>
              <Text style={[styles.rekapLabel, { color: theme.textSecondary }]}>
                Izin / Sakit
              </Text>
            </View>

            <View style={styles.rekapItem}>
              <Text style={[styles.rekapValue, { color: theme.danger }]}>
                6 Hari
              </Text>
              <Text style={[styles.rekapLabel, { color: theme.textSecondary }]}>
                Tanpa Keterangan
              </Text>
            </View>
          </View>
        </View>

        {/* MENU UTAMA */}
        <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
          Menu
        </Text>

        <View style={styles.menuRow}>
          {/* IZIN */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Izin')}
          >
            <Ionicons
              name="document-text-outline"
              size={30}
              color={theme.primary}
            />
            <Text style={[styles.menuText, { color: theme.textPrimary }]}>
              Izin
            </Text>
          </TouchableOpacity>

          {/* SAKIT */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Sakit')}
          >
            <Ionicons name="medkit-outline" size={30} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.textPrimary }]}>
              Sakit
            </Text>
          </TouchableOpacity>

          {/* LEMBUR */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Lembur')}
          >
            <Ionicons name="time-outline" size={30} color={theme.primary} />
            <Text style={[styles.menuText, { color: theme.textPrimary }]}>
              Lembur
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== PRESENSI (BARU) ===== */}
        <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
          Presensi Hari Ini
        </Text>

        {/* MASUK */}
        <View style={[styles.presensiCard, { backgroundColor: theme.card }]}>
          <View style={styles.presensiHeader}>
            <Text style={styles.presensiDate}>
              {today.dayName}, {today.fullDate}
            </Text>
            <Text style={[styles.presensiLabel, { color: theme.primary }]}>
              Jam Masuk
            </Text>
          </View>

          <View style={styles.presensiBody}>
            <Ionicons name="location" size={18} color={theme.primary} />
            <Text style={[styles.presensiStatus, { color: theme.primary }]}>
              Belum absensi masuk
            </Text>
            <Text style={[styles.presensiTime, { color: theme.primary }]}>
              --:--
            </Text>
          </View>
        </View>

        {/* KELUAR */}
        <View style={[styles.presensiCard, { backgroundColor: theme.card }]}>
          <View style={styles.presensiHeader}>
            <Text style={styles.presensiDate}>
              {today.dayName}, {today.fullDate}
            </Text>
            <TouchableOpacity style={styles.deleteRow}>
              <Ionicons name="trash" size={16} color={theme.danger} />
              <Text style={[styles.deleteText, { color: theme.danger }]}>
                Hapus
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.presensiBody}>
            <Ionicons name="location" size={18} color={theme.primary} />
            <Text style={[styles.presensiStatus, { color: theme.primary }]}>
              Belum absensi keluar
            </Text>
            <Text style={[styles.presensiTime, { color: theme.primary }]}>
              --:--
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ===== INFO + REKAP ===== */
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  shiftText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  timeText: {
    fontSize: 14,
    marginVertical: 2,
  },

  subText: {
    fontSize: 12,
  },

  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  rekapTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  rekapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rekapItem: {
    flex: 1,
    alignItems: 'center',
  },

  rekapValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  rekapLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  /* ===== MENU ===== */
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },

  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  menuItem: {
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  menuText: {
    fontSize: 12,
    marginTop: 6,
  },

  /* ===== PRESENSI ===== */
  presensiCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  presensiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  presensiDate: {
    fontSize: 14,
    fontWeight: '600',
  },

  presensiLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

  presensiBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  presensiStatus: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
  },

  presensiTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* ===== LOGOUT ===== */
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
