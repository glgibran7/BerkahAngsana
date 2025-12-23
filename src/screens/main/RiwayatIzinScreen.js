import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header';
import Api from '../../utils/Api';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@react-native-vector-icons/ionicons';

const RiwayatIzinScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';

  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = {
    background: isDark ? '#0E0E0E' : '#F5F5F5',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    primary: '#8B1E1E',
    pending: '#F9A825',
    approved: '#2E7D32',
    rejected: '#C62828',
  };

  /* ================= UTIL ================= */

  const formatTanggal = dateStr =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatMonth = date =>
    date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

  /* ================= FETCH ================= */

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const res = await Api.get('/izin/saya');
      setData(res.data?.data || []);
    } catch (err) {
      console.log('ERROR RIWAYAT:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchRiwayat();
    } finally {
      setRefreshing(false);
    }
  };

  /* ================= FILTER + SUMMARY ================= */

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const d = new Date(item.tgl_mulai);
      return (
        d.getMonth() === selectedMonth.getMonth() &&
        d.getFullYear() === selectedMonth.getFullYear()
      );
    });
  }, [data, selectedMonth]);

  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.status_approval === 'approved') acc.approved += 1;
        else if (item.status_approval === 'rejected') acc.rejected += 1;
        else acc.pending += 1;
        return acc;
      },
      { total: 0, approved: 0, rejected: 0, pending: 0 },
    );
  }, [filteredData]);

  const getStatusColor = status => {
    if (status === 'approved') return theme.approved;
    if (status === 'rejected') return theme.rejected;
    return theme.pending;
  };

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {item.nama_izin}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: getStatusColor(item.status_approval) },
          ]}
        >
          <Text style={styles.badgeText}>{item.status_approval}</Text>
        </View>
      </View>

      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {formatTanggal(item.tgl_mulai)} – {formatTanggal(item.tgl_selesai)}
      </Text>

      <Text style={[styles.text, { color: theme.textPrimary }]}>
        {item.keterangan}
      </Text>

      {item.alasan_penolakan && (
        <Text style={styles.rejectText}>Alasan: {item.alasan_penolakan}</Text>
      )}
    </View>
  );

  return (
    <>
      <Header
        title="Riwayat Pengajuan Izin"
        showBack
        showGreeting={false}
        showProfileInitial={false}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        style={{ backgroundColor: theme.background }}
        data={filteredData}
        keyExtractor={item => String(item.id_izin)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={loading || refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.monthPicker}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.primary}
              />
              <Text style={[styles.monthText, { color: theme.textPrimary }]}>
                {formatMonth(selectedMonth)}
              </Text>
            </TouchableOpacity>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.approved }]}>
                  {summary.approved}
                </Text>
                <Text style={styles.summaryLabel}>Disetujui</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.pending }]}>
                  {summary.pending}
                </Text>
                <Text style={styles.summaryLabel}>Menunggu</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.rejected }]}>
                  {summary.rejected}
                </Text>
                <Text style={styles.summaryLabel}>Ditolak</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
            Tidak ada data izin
          </Text>
        }
      />

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
    </>
  );
};

export default RiwayatIzinScreen;

/* ================= STYLE ================= */

const styles = StyleSheet.create({
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
    marginBottom: 12,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
  },

  text: {
    fontSize: 13,
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  rejectText: {
    marginTop: 6,
    fontSize: 12,
    color: '#E53935',
  },
});
