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

const formatDateLong = dateStr => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

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

const diffDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

/* ================= CONSTANT ================= */
const JENIS_IZIN = {
  4: { label: 'Sakit', color: '#E53935' },
  3: { label: 'Izin', color: '#FB8C00' },
  5: { label: 'Cuti', color: '#1E88E5' },
};

const STATUS_COLOR = {
  approved: '#4CAF50',
};

/* ================= SCREEN ================= */
const RekapIzinSakitScreen = ({ navigation }) => {
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

  /* ===== FETCH (HANYA APPROVED) ===== */
  const fetchIzin = async (date = selectedMonth) => {
    try {
      setLoading(true);
      const { start_date, end_date } = getStartEndOfMonth(date);

      const res = await Api.get(
        `/perizinan-new?id_karyawan=${user?.id_karyawan}&start_date=${start_date}&end_date=${end_date}`,
      );

      const approvedOnly =
        res.data?.data?.filter(item => item.status_izin === 'approved') || [];

      setData(approvedOnly);
    } catch (err) {
      console.log('Error fetch izin:', err?.response?.data || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIzin(selectedMonth);
  }, [selectedMonth]);

  /* ===== SUMMARY (APPROVED SAJA) ===== */
  const summary = useMemo(() => {
    const r = { sakit: 0, izin: 0, cuti: 0 };
    data.forEach(i => {
      if (i.id_jenis === 4) r.sakit++;
      if (i.id_jenis === 3) r.izin++;
      if (i.id_jenis === 5) r.cuti++;
    });
    return r;
  }, [data]);

  return (
    <>
      <Header
        title="Rekapan Izin, Sakit & Cuti"
        showGreeting={false}
        showNotification={false}
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
            onRefresh={() => fetchIzin(selectedMonth)}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* ===== SUMMARY + PICKER ===== */}
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
            <SummaryItem label="Sakit" value={summary.sakit} color="#E53935" />
            <SummaryItem label="Izin" value={summary.izin} color="#FB8C00" />
            <SummaryItem label="Cuti" value={summary.cuti} color="#1E88E5" />
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
          data.map(item => {
            const jenis = JENIS_IZIN[item.id_jenis];
            const hari = diffDays(item.tgl_mulai, item.tgl_selesai);

            return (
              <View
                key={item.id_izin}
                style={[styles.card, { backgroundColor: theme.card }]}
              >
                {/* BARIS TANGGAL */}
                <View style={styles.rowBetween}>
                  <Text style={[styles.date, { color: theme.textPrimary }]}>
                    {formatDateLong(item.tgl_mulai)}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                    {hari} Hari
                  </Text>
                </View>

                {/* BARIS STATUS + JENIS */}
                <View style={styles.rowBetween}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: STATUS_COLOR.approved,
                    }}
                  >
                    APPROVED
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: jenis?.color,
                    }}
                  >
                    {jenis?.label}
                  </Text>
                </View>

                {/* KETERANGAN */}
                <Text
                  style={[styles.keterangan, { color: theme.textSecondary }]}
                >
                  {item.keterangan || '-'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

export default RekapIzinSakitScreen;

/* ================= COMPONENT ================= */
const SummaryItem = ({ label, value, color }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color }}>{value}</Text>
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

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 14,
    fontWeight: '600',
  },

  keterangan: {
    fontSize: 12,
    marginTop: 6,
  },
});
