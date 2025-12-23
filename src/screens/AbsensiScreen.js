import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  PermissionsAndroid,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import Api from '../utils/Api';

const AbsensiScreen = () => {
  const isDark = useColorScheme() === 'dark';

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [statusAbsen, setStatusAbsen] = useState('IN');

  const theme = {
    background: isDark ? '#0E0E0E' : '#F4F4F4',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    primary: '#D32F2F',
    success: '#2E7D32',
    text: isDark ? '#FFF' : '#000',
    subText: isDark ? '#AAA' : '#777',
  };

  /* ================= PERMISSION ================= */

  const requestPermission = async permission => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  /* ================= LOCATION ================= */

  useEffect(() => {
    const initLocation = async () => {
      const allowed = await requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (!allowed) {
        Alert.alert('Izin Ditolak', 'Lokasi wajib diizinkan');
        setLoadingLocation(false);
        return;
      }

      Geolocation.getCurrentPosition(
        pos => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLoadingLocation(false);
        },
        () => {
          Alert.alert('Error', 'Gagal mengambil lokasi');
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 20000 },
      );
    };

    initLocation();
  }, []);

  /* ================= CAMERA ================= */

  const takePhoto = async () => {
    const allowed = await requestPermission(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (!allowed) {
      Alert.alert('Izin Ditolak', 'Kamera tidak diizinkan');
      return;
    }

    const res = await launchCamera({
      cameraType: 'front',
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (res.didCancel || res.errorCode) return;

    const asset = res.assets?.[0];
    if (asset) {
      setPhoto({
        uri: asset.uri,
        name: asset.fileName || 'selfie.jpg',
        type: asset.type || 'image/jpeg',
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!photo || !location) {
      Alert.alert('Validasi', 'Foto dan lokasi wajib tersedia');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('foto', {
        uri: photo.uri,
        name: photo.name,
        type: photo.type,
      });
      formData.append('latitude', String(location.latitude));
      formData.append('longitude', String(location.longitude));

      const url =
        statusAbsen === 'IN' ? '/absensi/check-in' : '/absensi/check-out';

      console.log('ABSENSI URL:', url);

      await Api.post(url, formData);

      Alert.alert(
        'Berhasil',
        statusAbsen === 'IN' ? 'Check-in berhasil' : 'Check-out berhasil',
      );

      setPhoto(null);
      setStatusAbsen(statusAbsen === 'IN' ? 'OUT' : 'IN');
    } catch (err) {
      console.log('ABSENSI ERROR:', err?.response?.data || err);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Gagal mengirim absensi',
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  const isCheckIn = statusAbsen === 'IN';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Ionicons
          name={isCheckIn ? 'log-in-outline' : 'log-out-outline'}
          size={52}
          color={isCheckIn ? theme.primary : theme.success}
        />

        <Text style={[styles.title, { color: theme.text }]}>
          {isCheckIn ? 'Check-In' : 'Check-Out'}
        </Text>

        <TouchableOpacity style={styles.photoBox} onPress={takePhoto}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.photo} />
          ) : (
            <Ionicons name="camera-outline" size={28} color={theme.subText} />
          )}
        </TouchableOpacity>

        <View style={styles.locationRow}>
          {loadingLocation ? (
            <ActivityIndicator size="small" />
          ) : (
            <Ionicons
              name="location"
              size={16}
              color={location ? 'green' : theme.subText}
            />
          )}
          <Text style={[styles.locationText, { color: theme.subText }]}>
            {location ? 'Lokasi terdeteksi' : 'Mengambil lokasi...'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            {
              backgroundColor: isCheckIn ? theme.primary : theme.success,
              opacity: photo && location && !loading ? 1 : 0.5,
            },
          ]}
          disabled={!photo || !location || loading}
          onPress={handleSubmit}
        >
          <Text style={styles.btnPrimaryText}>
            {loading ? 'Memproses...' : isCheckIn ? 'CHECK-IN' : 'CHECK-OUT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AbsensiScreen;

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  card: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },
  title: { marginVertical: 12, fontSize: 18, fontWeight: '700' },
  photoBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 16,
  },
  photo: { width: '100%', height: '100%' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locationText: { marginLeft: 6, fontSize: 12 },
  btnPrimary: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  btnPrimaryText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
