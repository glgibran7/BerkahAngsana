import React, { useEffect, useMemo, useState } from 'react';
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
import { useGlobal } from '../../context/GlobalContext';

/* ================= UTIL ================= */
const formatMonth = date =>
  date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

const formatDateLong = dateStr =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatYMD = date => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getStartEndOfMonth = date => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start_date: formatYMD(start),
    end_date: formatYMD(end),
  };
};

const menitKeJam = menit => {
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  return `${jam}j ${sisa}m`;
};

/* ================= SCREEN ================= */
const RekapLemburScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';
  const { user } = useGlobal();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    primary: '#8B1E1E',
  };

  /* ===== FETCH LEMBUR ===== */
  const fetchLembur = async (date = selectedMonth) => {
    try {
      setLoading(true);
      const { start_date, end_date } = getStartEndOfMonth(date);

      const res = await Api.get(
        `/lembur?id_karyawan=${user?.id_karyawan}&start_date=${start_date}&end_date=${end_date}`,
      );

      // ambil hanya approved
      const approved = (res.data?.data || []).filter(
        i => i.status_lembur === 'approved',
      );

      setData(approved);
    } catch (err) {
      console.log('Error fetch lembur:', err?.response?.data || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLembur(selectedMonth);
  }, [selectedMonth]);

  /* ===== SUMMARY ===== */
  const summary = useMemo(() => {
    return {
      totalLembur: data.length,
      totalJam: data.reduce((a, b) => a + (b.menit_lembur || 0), 0),
      totalBayar: data.reduce((a, b) => a + (b.total_bayaran || 0), 0),
    };
  }, [data]);

  return (
    <>
      <Header
        title="Rekapan Lembur"
        showNotification={false}
        showGreeting={false}
        showProfileInitial={false}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchLembur(selectedMonth)}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* ===== TOP CARD (JANGAN DIUBAH) ===== */}
        <View style={[styles.topCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.monthRow}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            <Text style={[styles.monthText, { color: theme.textPrimary }]}>
              {formatMonth(selectedMonth)}
            </Text>
          </TouchableOpacity>

          <View style={styles.summaryRow}>
            <SummaryItem label="Hari Lembur" value={summary.totalLembur} />
            <SummaryItem
              label="Total Jam"
              value={menitKeJam(summary.totalJam)}
            />
            <SummaryItem
              label="Total Bayar"
              value={`Rp ${summary.totalBayar.toLocaleString('id-ID')}`}
            />
          </View>
        </View>

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

        {/* ===== LIST ===== */}
        {data.length === 0 ? (
          <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
            Data tidak tersedia
          </Text>
        ) : (
          data.map(item => (
            <View
              key={item.id_lembur}
              style={[styles.card, { backgroundColor: theme.card }]}
            >
              <Text style={[styles.date, { color: theme.textPrimary }]}>
                {formatDateLong(item.tanggal)}
              </Text>
              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Keterangan
                </Text>
                <Text
                  style={{
                    color: theme.textPrimary,
                    fontSize: 12,
                    textTransform: '',
                  }}
                >
                  {item.keterangan || '-'}
                </Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Jam
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 12 }}>
                  {item.jam_mulai} - {item.jam_selesai}
                </Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Durasi
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 12 }}>
                  {menitKeJam(item.menit_lembur)}
                </Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Total Bayar
                </Text>
                <Text
                  style={{
                    color: theme.primary,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Rp {item.total_bayaran.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};

export default RekapLemburScreen;

/* ================= COMPONENT ================= */
const SummaryItem = ({ label, value }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
    <Text style={{ fontSize: 12 }}>{label}</Text>
  </View>
);

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },

  topCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  monthRow: {
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

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  keterangan: {
    fontSize: 12,
    marginTop: 6,
  },
});
