import * as Location from 'expo-location';
import { Alert } from 'react-native';

const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Location permission denied");
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error requesting location permission:', err);
    return false;
  }
};

const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) return;

  try {
    const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const { latitude, longitude } = coords;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  } catch (error) {
    console.error("Error getting location:", error);
  }
};

export default getCurrentLocation;