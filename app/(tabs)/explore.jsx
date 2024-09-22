import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRCodeScannerPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      `QR Code Scanned!`,
      `Type: ${type} \nData: ${data}`,
      [
        {
          text: "Go to URL",
          onPress: () => {
            Linking.openURL(data).catch(err => console.error("Failed to open URL:", err));
          }
        },
        { text: "Cancel", onPress: () => setScanned(false) }
      ]
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRCodeScannerPage;
