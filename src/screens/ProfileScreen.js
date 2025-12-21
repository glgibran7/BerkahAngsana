import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext';
import Api from '../utils/Api';

/* ================= UTIL ================= */
const capitalizeWords = (str = '') =>
  str
    .toLowerCase()
    .split(' ')
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');

const formatNIP = nip => {
  if (nip === null || nip === undefined) return '-';
  return String(nip).padStart(3, '0');
};

const ProfileScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';
  const { user } = useGlobal();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#9E9E9E' : '#757575',
    divider: isDark ? '#2A2A2A' : '#EEEEEE',
    primary: '#D32F2F',
  };

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      if (!user?.id_karyawan) return;

      const res = await Api.get(`/pegawai/${user.id_karyawan}`);
      setProfile(res.data?.data);
    } catch (err) {
      console.log(err?.response?.data || err);
      Alert.alert('Error', 'Gagal mengambil data profil');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfile().finally(() => setLoading(false));
  }, []);

  /* ================= REFRESH ================= */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile().finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        title="Profile"
        showGreeting={false}
        showNotification={false}
        showProfileInitial={false}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* ===== LOADING ===== */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {!loading && profile && (
          <>
            {/* ===== INFORMASI AKUN ===== */}
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={theme.primary}
                />
                <Text
                  style={[styles.sectionTitle, { color: theme.textPrimary }]}
                >
                  Informasi Akun
                </Text>
              </View>

              {renderRow('Nama Lengkap', capitalizeWords(profile.nama), theme)}
              {/* {renderRow(
                'Nama Panggilan',
                capitalizeWords(profile.nama_panggilan || '-'),
                theme,
              )} */}
              {renderRow('Username', profile.username, theme)}
              {renderRow('NIP', formatNIP(profile.nip), theme)}
            </View>

            {/* ===== INFORMASI PEKERJAAN ===== */}
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={theme.primary}
                />
                <Text
                  style={[styles.sectionTitle, { color: theme.textPrimary }]}
                >
                  Informasi Pekerjaan
                </Text>
              </View>

              {renderRow(
                'Jenis Pegawai',
                capitalizeWords(profile.jenis),
                theme,
              )}
              {renderRow('Tipe Pegawai', capitalizeWords(profile.tipe), theme)}
              {renderRow(
                'Gaji Pokok',
                `Rp. ${Number(profile.gaji_pokok).toLocaleString('id-ID')}`,
                theme,
              )}
            </View>

            {/* ===== INFORMASI BANK ===== */}
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="card-outline" size={18} color={theme.primary} />
                <Text
                  style={[styles.sectionTitle, { color: theme.textPrimary }]}
                >
                  Informasi Bank
                </Text>
              </View>

              {renderRow('Bank', profile.bank, theme)}
              {renderRow('No Rekening', profile.no_rekening, theme)}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

/* ================= ROW COMPONENT ================= */
const renderRow = (label, value, theme) => (
  <>
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
    </View>
    <View style={[styles.rowDivider, { backgroundColor: theme.divider }]} />
  </>
);

export default ProfileScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  row: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowDivider: {
    height: 1,
    opacity: 0.6,
  },

  label: {
    fontSize: 12,
  },

  value: {
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '55%',
  },

  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});
