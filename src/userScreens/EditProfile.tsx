import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import themeStyle from '../styles/themeStyle';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalButton from '../components/GlobalButton';
import BazierChartRestaurant from '../components/BazierChartRestaurant';
import { BaseurlBuyer } from '../Apis/apiConfig';

const EditProfile = ({ navigation }) => {
  const [data, setdata] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setloading] = useState(false);

  const fetchData = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    const buyerToken = await AsyncStorage.getItem('buyerToken');
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-access-token': buyerToken, // Include the en in the Authorization header
        'Content-Type': 'application/json', // Assuming JSON format
      },
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `${BaseurlBuyer}/${buyerId}`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result, 'eeeeeeee');
      setdata(result);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
    }
  }, [data]);

  const handleSave = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    const buyerToken = await AsyncStorage.getItem('buyerToken');
    const myHeaders = {
      'x-access-token': buyerToken, // Include the en in the Authorization header
      'Content-Type': 'application/json', // Assuming JSON format
    };
    setloading(true);
    try {
      const raw = JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        id: buyerId,
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        `${BaseurlBuyer}`,
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        Snackbar.show({
          text: 'Profile updated successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
        navigation.goBack();
        console.log(result);
        setloading(false);
      } else {
        Snackbar.show({
          text: 'Failed to update profile. Please try again.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
        console.error(result);
        setloading(false);
      }
    } catch (error) {
      Snackbar.show({
        text: 'Failed to update profile. Please try again.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      setloading(false);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image
              resizeMode="contain"
              style={{ width: 30, height: 20 }}
              source={require('../../assets/images/Cart/back.png')}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <BazierChartRestaurant />

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}> NAME</Text>
          <TextInput
            style={styles.infoText}
            value={name}
            onChangeText={setName}
            placeholder="Enter  name"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>EMAIL</Text>
          <TextInput
            style={styles.infoText}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>PHONE NUMBER</Text>
          <TextInput
            style={styles.infoText}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="numeric"
          />
        </View>

        <GlobalButton
          loading={loading}
          marginTop={20}
          onPress={handleSave}
          title={'SAVE'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
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
    marginLeft: '25%',
    color: 'black',
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: themeStyle.TEXT_GREY,
    borderWidth: 1,
    paddingHorizontal: 10,
    // elevation: 0.5,
    borderRadius: 10,
    marginTop: 5,
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
});
