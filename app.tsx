import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './src/styles';


interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export default function App() {
  // Estados
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchSubscription, setWatchSubscription] = useState<Location.LocationSubscription | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  // Referência para o MapView
  const mapRef = useRef<MapView>(null);

  // Função para solicitar permissões de localização
  const requestLocationPermissions = async (): Promise<boolean> => {
    try {
      console.log('Solicitando permissões de localização...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada!');
        Alert.alert(
          'Permissão Negada',
          'Este aplicativo precisa de acesso à sua localização para funcionar corretamente.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      console.log('Permissão de localização concedida');
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      setErrorMsg('Erro ao solicitar permissões de localização');
      return false;
    }
  };


  const getCurrentLocation = async (): Promise<void> => {
    try {
      console.log('Obtendo localização atual...');
      setIsLoading(true);

      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Localização obtida:', currentPosition.coords);
      setLocation(currentPosition);

      // Configurar a região do mapa
      const newRegion: Region = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setMapRegion(newRegion);

      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setErrorMsg('Erro ao obter localização atual');
      setIsLoading(false);
    }
  };

  // Função para iniciar o monitoramento em tempo real
  const startWatchingLocation = async (): Promise<void> => {
    try {
      console.log('Iniciando monitoramento de localização...');

      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation: LocationObject) => {
          console.log('Localização atualizada:', newLocation.coords);
          setLocation(newLocation);

          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 1000);
          }
        }
      );

      setWatchSubscription(subscription);
      console.log('Monitoramento iniciado');
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error);
      setErrorMsg('Erro ao monitorar localização');
    }
  };

    // Função para parar o monitoramento em tempo real
  const stopWatchingLocation = (): void => {
    if (watchSubscription) {
      watchSubscription.remove();
      setWatchSubscription(null);
      console.log('Monitoramento parado');
    }
  };

  // Função para centralizar o mapa na localização atual
  const centerMapOnUser = (): void => {
    if (location && mapRef.current) {
      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  useEffect(() => {
    console.log('Inicializando aplicação...');
    
    const initializeApp = async () => {
      await getCurrentLocation();
      await startWatchingLocation();
    };

    initializeApp();

  
    return () => {
      stopWatchingLocation();
    };
  }, []);

  // Renderizar mensagem de erro
  const renderError = () => {
    if (!errorMsg) return null;

    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={24} color="red" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  };

  // Renderizar loading
  const renderLoading = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    );
  };

  // Renderizar informações da localização
  const renderLocationInfo = () => {
    if (!location) return null;

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Lat: {location.coords.latitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          Lng: {location.coords.longitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
           Precisão: {location.coords.accuracy ? `${location.coords.accuracy.toFixed(2)}m` : 'N/A'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      {mapRegion && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
        >
          {/* Marcador da localização atual */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
              description="Você está aqui!"
              pinColor="#007AFF"
            />
          )}
        </MapView>
      )}

      {/* Botão para centralizar no usuário */}
      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
        <MaterialIcons name="my-location" size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Container de controles */}
      <View style={styles.controlsContainer}>
        {/* Botões de ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={getCurrentLocation}
          >
            <MaterialIcons name="gps-fixed" size={20} color="white" />
            <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, watchSubscription ? styles.stopButton : styles.startButton]} 
            onPress={watchSubscription ? stopWatchingLocation : startWatchingLocation}
          >
            <MaterialIcons 
              name={watchSubscription ? "gps-off" : "gps-not-fixed"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {watchSubscription ? 'Parar' : 'Monitorar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informações da localização */}
        {renderLocationInfo()}
      </View>

      {/* Loading */}
      {renderLoading()}

      {/* Erro */}
      {renderError()}

      {/* Estado do monitoramento */}
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: watchSubscription ? '#4CAF50' : '#FF5722' }
            ]} 
          />
          <Text style={styles.statusText}>
            Monitoramento: {watchSubscription ? 'ATIVO' : 'INATIVO'}
          </Text>
        </View>
      </View>
    </View>
  );
}