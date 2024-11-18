import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import CustomRadioButton from '../components/CustomRadioButton';
import themeStyle from '../styles/themeStyle';

export default function ChooseLanguage({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const handleSave = () => {
    // Handle save logic here, e.g., save the selected language to state or storage
    console.log(`Selected Language: ${selectedLanguage}`);
    // Navigate to another screen or show a confirmation
    navigation.goBack(); // Example navigation action
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Language</Text>
      </View>
      <View style={styles.content}>
        <CustomRadioButton
          value="English"
          status={selectedLanguage === 'English' ? 'checked' : 'unchecked'}
          onPress={() => handleSelectLanguage('English')}
        />
        {/* Add more languages if needed */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 70,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop:20
  },
  saveButton: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    position:"absolute",
    width:'100%',
    alignSelf:"center",
    bottom:50
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
