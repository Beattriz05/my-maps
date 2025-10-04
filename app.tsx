import { View } from 'react-native';

import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    LocationObject

} from 'expo-location';

import { styles } from './styles';
import { use } from 'react';

export default function App() {
    const[location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);


  return (
    <View style={styles.container}>
    </View>
  );
}