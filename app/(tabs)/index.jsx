// import React, { useState, useRef } from 'react';
// import { View, Text, Button, TextInput, StyleSheet, Share } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import * as FileSystem from 'expo-file-system';
// import { captureRef } from 'react-native-view-shot';
// import * as Sharing from 'expo-sharing';

// const App = () => {
//   const [url, setUrl] = useState('');
//   const [theme, setTheme] = useState('light');
//   const qrRef = useRef();

//   const isValidUrl = (string) => {
//     const res = string.match(/^(ftp|http|https):\/\/[^ "]+$/);
//     return res !== null;
//   };

//   const handleShareQRCode = async () => {
//     if (qrRef.current) {
//       const uri = await captureRef(qrRef, {
//         format: 'jpg',
//         quality: 1,
//       });
//       await Sharing.shareAsync(uri);
//     }
//   };

//   const handleGenerateQRCode = async () => {
//     if (!isValidUrl(url)) {
//       alert('Please enter a valid URL');
//       return;
//     }
//     try {
//       const uri = await captureRef(qrRef, {
//         format: 'jpg',
//         quality: 1,
//       });
//       await Share.share({ url: uri });
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleDownloadQRCode = async () => {
//     if (!url) {
//       Alert.alert('No URL', 'Please generate a QR code first');
//       return;
//     }
//     try {
//       const uri = await captureRef(qrRef, {
//         format: 'jpg',
//         quality: 1,
//       });
//       const fileUri = FileSystem.documentDirectory + 'QRCode.jpg';
//       await FileSystem.writeAsStringAsync(fileUri, await FileSystem.readAsStringAsync(uri));
//       await MediaLibrary.saveToLibraryAsync(fileUri);
//       Alert.alert('QR Code Saved', 'QR Code has been saved to your device.');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to download QR Code');
//     }
//   };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>QR Code Generator</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter a valid URL"
//         value={url}
//         onChangeText={setUrl}
//       />
//       <View style={styles.themeContainer}>
//         <Button title="Light Theme" onPress={() => setTheme('light')} />
//         <Button title="Dark Theme" onPress={() => setTheme('dark')} />
//       </View>
//       <View style={styles.qrContainer} ref={qrRef}>
//         {isValidUrl(url) && (
//           <QRCode
//             value={url}
//             size={200}
//             backgroundColor={theme === 'light' ? '#ffffff' : '#000000'}
//             color={theme === 'light' ? '#000000' : '#ffffff'}
//           />
//         )}
//       </View>
//       <Button title="Generate QR Code" onPress={handleGenerateQRCode} />
//       <Button title="Share QR Code" onPress={handleShareQRCode} />
//       <Button title="Download QR Code" onPress={handleDownloadQRCode} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     width: '100%',
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   themeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 20,
//   },
//   qrContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default App;

//------------------------------
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { WindowWidth } from './GobalCSS'

export default function QRCodeGenerator() {
    const [qrValue, setQRValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState('');
    const [selectedColor, setSelectedColor] = useState('black'); // State for QR code color
    let myQRCode = useRef();

    const isValidURL = (string) => {
        const regex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/;
        return regex.test(string);
    };

    const generateQRCode = () => {
        if (!qrValue.trim() || !isValidURL(qrValue.trim())) {
            setError('Please enter a valid URL.');
            setIsActive(false);
            return;
        }
        setIsActive(true);
        setError('');
    };

    const handleInputChange = (text) => {
        setQRValue(text);
        if (!text || !isValidURL(text)) {
            setError('');
            setIsActive(false);
        }
    };

    const getLogoFromURL = () => {
        if (qrValue.includes('www.instagram.com')) {
            return require('../../assets/images/instagram.jpg');
        } else if (qrValue.includes('facebook.com')) {
            return require('../../assets/images/facebook.jpg');
        } else if (qrValue.includes('www.google.com')) {
            return require('../../assets/images/google.jpg');
        } else if (qrValue.includes('snapchat.com')) {
            return require('../../assets/images/social.jpg');
        }
        return null;
    };

    const shareQRCode = () => {
        myQRCode.current.toDataURL((dataURL) => {
            if (dataURL) {
                const shareOptions = {
                    title: 'QR Code',
                    message: ` ${qrValue}`,
                    url: `data:image/jpg;base64,${dataURL}`,
                    subject: 'Share QR Code', // For email
                };
                Share.share(shareOptions).catch((error) => console.log(error));
            } else {
                Alert.alert('Error', 'Could not generate QR code. Please try again.');
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>QR Code Generator</Text>
                <Text style={styles.description}>
                    Paste a URL to create a QR code
                </Text>
                <TextInput
                    style={[styles.input, error ? styles.inputError : null]}
                    placeholder="Enter URL"
                    value={qrValue}
                    onChangeText={handleInputChange}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity
                    style={styles.button}
                    onPress={generateQRCode}
                    accessibilityLabel="Generate QR Code"
                    accessibilityHint="Generates a QR code based on the entered URL"
                >
                    <Text style={styles.buttonText}>Generate QR Code</Text>
                </TouchableOpacity>
                <View style={styles.colorPickerContainer}>
                    <Text style={styles.colorPickerText}>Select Color:</Text>
                    <TouchableOpacity
                        style={[styles.colorPickerOption, { backgroundColor: 'black' }]}
                        onPress={() => setSelectedColor('black')}
                    />
                    <TouchableOpacity
                        style={[styles.colorPickerOption, { backgroundColor: 'blue' }]}
                        onPress={() => setSelectedColor('blue')}
                    />
                    <TouchableOpacity
                        style={[styles.colorPickerOption, { backgroundColor: 'red' }]}
                        onPress={() => setSelectedColor('red')}
                    />
                    <TouchableOpacity
                        style={[styles.colorPickerOption, { backgroundColor: 'green' }]}
                        onPress={() => setSelectedColor('green')}
                    />
                </View>
                {isActive && (
                    <View style={styles.qrCode}>
                        <QRCode
                            value={qrValue}
                            size={200}
                            color={selectedColor} // Dynamic color selection
                            backgroundColor="white"
                            getRef={(c) => (myQRCode.current = c)}
                            logo={getLogoFromURL()}
                            logoSize={50}
                            logoBackgroundColor="transparent"
                        />
                    </View>
                )}
            </View>
            {/* <TouchableOpacity
                style={styles.buttonStyle}
                onPress={shareQRCode}
            >
                <Text style={styles.buttonTextStyle}>
                    Share QR Code
                </Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    wrapper: {
        width: WindowWidth * 0.8,
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
    },
    buttonStyle: {
        backgroundColor: '#51D8C7',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#51D8C7',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 30,
        padding: 10,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 21,
        fontWeight: '500',
        marginBottom: 10,
    },
    description: {
        color: '#575757',
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        padding: 17,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        marginBottom: 10,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#3498DB',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    colorPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    colorPickerText: {
        marginRight: 10,
        fontSize: 16,
    },
    colorPickerOption: {
        width: 20,
        height: 20,
        borderRadius: 15,
        marginHorizontal: 2,
        marginTop: 10,
    },
    qrCode: {
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 20,
    },
});
