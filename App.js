import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import atualizado
import { startLocationTracking, stopLocationTracking } from './src/services/LocationService';

export default function App() {
  const [isTracking, setIsTracking] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleTracking = () => {
    if (!selectedRoute) {
      alert('Por favor, selecione uma rota.');
      return;
    }

    if (isTracking) {
      stopLocationTracking();
    } else {
      startLocationTracking(selectedRoute);
    }
    setIsTracking(!isTracking);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Selecione uma Rota</Text>

      {/* Menu de seleção de rotas */}
      <Picker
        selectedValue={selectedRoute}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setSelectedRoute(itemValue)}
      >
        <Picker.Item label="Selecione uma rota..." value={null} />
        <Picker.Item label="Rota São Pedro" value="Rota São Pedro" />
        <Picker.Item label="Rota Cohab" value="Rota Cohab" />
      </Picker>

      {/* Botão de iniciar/parar rastreamento */}
      <Button
        title={isTracking ? 'Parar Rastreamento' : 'Iniciar Rastreamento'}
        onPress={handleTracking}
      />
    </View>
  );
}
