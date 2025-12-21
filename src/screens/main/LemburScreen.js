import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Header from '../../components/Header';

const LemburScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <>
      <Header
        title="Pengajuan Lembur"
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
          Halaman Pengajuan Lembur
        </Text>
      </View>
    </>
  );
};

export default LemburScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
