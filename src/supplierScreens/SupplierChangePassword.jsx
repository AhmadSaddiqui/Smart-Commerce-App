
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, ToastAndroid } from 'react-native';
import themeStyle from '../styles/themeStyle';
import { ROUTES } from '../routes/RoutesConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
// import { Ionicons } from 'react-native-vector-icons/Ionicons';

const SupplierChangePassword = ({ navigation }) => {

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('supplierId')
    navigation.replace(ROUTES.Onboarding)
  }



  const handleUpdate = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    console.log('supplierId:', supplierId);
    const token = await AsyncStorage.getItem('supplierToken');
    try {
      if (newPassword === confirmPassword) {
        // Log the request payload
        console.log('Request Payload:', JSON.stringify({
          id: supplierId,
          password: confirmPassword,
        }));

        const requestOptions = {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            id: supplierId,
            password: confirmPassword,
          }),
        };

        const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/supplier`, requestOptions);

        // Log the response text
        const textResponse = await response.text();
        console.log('Response text:', textResponse);

        // Try to parse the response as JSON
        let result;
        try {
          result = JSON.parse(textResponse);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          throw jsonError; // rethrow if JSON parsing fails
        }

        if (response.ok) {
          Snackbar.show({
            text: 'Password updated successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });
        } else {
          console.log('response:', result);
          Snackbar.show({
            text: 'Error updating password',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });
        }
      } else {
        Snackbar.show({
          text: 'New password & confirm password do not match',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
      }
    } catch (e) {
      console.log('Error updating...', e);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
            <Image resizeMode='contain' style={{ width: 30, height: 20 }} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>

        {/* <View style={styles.profileImageContainer}>
          <View style={styles.profileImage} />
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View> */}

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>New Password</Text>
          <TextInput style={styles.infoText}
            value={newPassword}
            placeholder='Enter new password'
            placeholderTextColor={themeStyle.TEXT_GREY}
            onChangeText={setNewPassword} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Confirm Password</Text>
          <TextInput style={styles.infoText}
            value={confirmPassword}
            placeholder='Enter confirm password'
            placeholderTextColor={themeStyle.TEXT_GREY}
            onChangeText={setConfirmPassword} />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SupplierChangePassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '15%',
    color: "black"
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD1BA',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF4B4B',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: 'black',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'black',
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 1)",
    // elevation:0.5,
    borderWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    // elevation:2

  },
  saveButton: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})