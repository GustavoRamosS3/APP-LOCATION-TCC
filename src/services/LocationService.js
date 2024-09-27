import 'react-native-get-random-values'; // Importa o suporte para getRandomValues no React Native
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import Parse from '../config/parseConfig';
import { Alert } from 'react-native';

let locationSubscription = null;
let routeObjectId = null;

// Função para buscar uma rota existente
const findExistingRoute = async (routeName) => {
  const Route = Parse.Object.extend('Route');
  const query = new Parse.Query(Route);
  query.equalTo('name', routeName); // Buscar rota pelo nome
  const route = await query.first(); // Retorna a primeira rota encontrada (se existir)
  return route;
};

const startLocationTracking = async (routeName) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de localização negada');
      return;
    }

    // Verificar se a rota já existe
    let existingRoute = await findExistingRoute(routeName);

    if (existingRoute) {
      // Se a rota existir, pegar o objectId para fazer update
      console.log('Rota existente encontrada:', existingRoute);
      routeObjectId = existingRoute.id;
    } else {
      // Se a rota não existir, criar uma nova
      const Route = Parse.Object.extend('Route');
      const route = new Route();
      route.set('name', routeName); // Definir nome da rota
      route.set('uuid', uuidv4());  // Gera um UUID para a rota

      const savedRoute = await route.save();
      console.log('Nova rota criada:', savedRoute);
      routeObjectId = savedRoute.id;
    }

    // Iniciar o rastreamento de localização
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1, // Atualiza a cada metro
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        console.log('Atualizando localização:', latitude, longitude);
        updateLocationInDatabase(latitude, longitude);
      }
    );
  } catch (error) {
    console.error('Erro ao iniciar o rastreamento de localização:', error);
  }
};

const stopLocationTracking = () => {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
    console.log('Rastreamento de localização parado');
  }
};

const updateLocationInDatabase = async (latitude, longitude) => {
  if (!routeObjectId) {
    console.error('Rota não inicializada. Não é possível atualizar a localização.');
    return;
  }

  try {
    const Route = Parse.Object.extend('Route');
    const query = new Parse.Query(Route);
    const route = await query.get(routeObjectId); // Buscar a rota existente pelo objectId

    // Adicionar as novas coordenadas ao array existente
    route.add('coords', { latitude, longitude });

    await route.save();
    console.log('Localização atualizada no banco de dados:', { latitude, longitude });
  } catch (error) {
    console.error('Erro ao atualizar a localização no banco de dados:', error);
  }
};

export { startLocationTracking, stopLocationTracking };
