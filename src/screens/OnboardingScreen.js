import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  useColorScheme,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Mudah Absensi',
    desc: 'Absensi cepat dan praktis langsung dari aplikasi',
  },
  {
    title: 'Realtime',
    desc: 'Data absensi langsung tersimpan secara realtime',
  },
  {
    title: 'Aman',
    desc: 'Data tersimpan dengan aman dan terenkripsi',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleScroll = event => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(slideIndex);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#020617' : '#FFFFFF' },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((item, i) => (
          <View key={i} style={styles.slide}>
            <Text
              style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            >
              {item.title}
            </Text>

            <Text
              style={[styles.desc, { color: isDark ? '#CBD5E1' : '#475569' }]}
            >
              {item.desc}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Indicator dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index ? '#2563EB' : isDark ? '#334155' : '#CBD5E1',
                width: i === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Footer button */}
      <View style={styles.footer}>
        {index === slides.length - 1 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Mulai</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  slide: {
    width,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },

  desc: {
    fontSize: 16,
    lineHeight: 24,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 999,
    elevation: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
