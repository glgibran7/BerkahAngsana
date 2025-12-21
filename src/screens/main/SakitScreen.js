import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Header from '../../components/Header';

const SakitScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <>
      <Header
        title="Pengajuan Sakit"
        showBack
        showGreeting={false}
        showNotification={false}
        onBack={() => navigation.goBack()}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#0E0E0E' : '#F6F6F6' },
        ]}
      >
        <Text style={{ color: isDark ? '#FFF' : '#000' }}>
          Halaman Pengajuan Sakit
        </Text>
      </View>
    </>
  );
};

export default SakitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
