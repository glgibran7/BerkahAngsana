import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';

const CutiScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';

  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#2E2E2E',
    textSecondary: isDark ? '#B0B0B0' : '#757575',
    primary: '#8B1E1E',
  };

  return (
    <>
      <Header
        title="Pengajuan Cuti"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Ionicons
            name="calendar-outline"
            size={40}
            color={theme.primary}
            style={{ marginBottom: 12 }}
          />

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Pengajuan Cuti
          </Text>

          <Text style={[styles.desc, { color: theme.textSecondary }]}>
            Silakan ajukan cuti sesuai dengan kebijakan perusahaan.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.buttonText}>Ajukan Cuti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CutiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  desc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
