import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Api from '../../utils/Api';

const RekapAbsensiScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    divider: isDark ? '#2A2A2A' : '#EEEEEE',
    primary: '#8B1E1E',
    success: '#4CAF50',
    danger: '#D32F2F',
    warning: '#F9A825',
  };

  /* ================= UTIL ================= */

  const formatMonth = date =>
    date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

  const formatDateDMY = date => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const getStartEndOfMonth = date => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      start_date: formatDateDMY(start),
      end_date: formatDateDMY(end),
    };
  };

  // YYYY-MM-DD → Senin, 1 Desember 2025
  const formatTanggalView = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusHariStyle = status => {
    switch (status) {
      case 'regular':
        return { bg: '#E3F2FD', text: '#1976D2' };
      case 'libur':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      default:
        return { bg: '#EEEEEE', text: '#616161' };
    }
  };

  /* ================= FETCH ================= */

  const fetchRekapAbsensi = async date => {
    try {
      setLoading(true);

      const { start_date, end_date } = getStartEndOfMonth(date);

      const res = await Api.get(
        `/rekapan/absensi/detail?start_date=${start_date}&end_date=${end_date}`,
      );

      setData(res.data.data || []);
    } catch (err) {
      console.log('Error fetch rekap absensi:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekapAbsensi(selectedMonth);
  }, [selectedMonth]);

  /* ================= SUMMARY ================= */

  const summary = data.reduce(
    (acc, item) => {
      if (item.nama_status === 'Hadir') acc.hadir += 1;
      else if (item.nama_status === 'Tidak Hadir') acc.alfa += 1;
      else acc.izin += 1;
      return acc;
    },
    { hadir: 0, alfa: 0, izin: 0 },
  );

  useEffect(() => {
    fetchRekapAbsensi(selectedMonth);
  }, [selectedMonth]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchRekapAbsensi(selectedMonth);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Header
        title="Rekapan Absensi"
        showGreeting={false}
        showNotification={false}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={loading || refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressBackgroundColor={theme.card}
          />
        }
      >
        {/* ===== CARD SUMMARY + DATE PICKER ===== */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.monthPicker}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            <Text style={[styles.monthText, { color: theme.textPrimary }]}>
              {formatMonth(selectedMonth)}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={selectedMonth}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowPicker(false);
                if (date) setSelectedMonth(date);
              }}
            />
          )}

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.success }]}>
                {summary.hadir}
              </Text>
              <Text style={styles.summaryLabel}>Hadir</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.danger }]}>
                {summary.alfa}
              </Text>
              <Text style={styles.summaryLabel}>Tanpa Keterangan</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.warning }]}>
                {summary.izin}
              </Text>
              <Text style={styles.summaryLabel}>Izin</Text>
            </View>
          </View>
        </View>

        {/* ===== LIST ===== */}
        {loading ? (
          <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
            Memuat data...
          </Text>
        ) : data.length === 0 ? (
          <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
            Data tidak tersedia
          </Text>
        ) : (
          data.map((item, index) => {
            const badge = getStatusHariStyle(item.status_hari);

            return (
              <View
                key={index}
                style={[styles.card, { backgroundColor: theme.card }]}
              >
                <Text style={[styles.date, { color: theme.textPrimary }]}>
                  {formatTanggalView(item.tanggal)}
                </Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {item.status_hari}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.status,
                      {
                        color:
                          item.nama_status === 'Tidak Hadir'
                            ? theme.danger
                            : theme.success,
                      },
                    ]}
                  >
                    {item.nama_status}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

export default RekapAbsensiScreen;

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  summaryCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },

  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  monthText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },

  summaryLabel: {
    fontSize: 12,
    color: '#757575',
  },

  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },

  date: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});
