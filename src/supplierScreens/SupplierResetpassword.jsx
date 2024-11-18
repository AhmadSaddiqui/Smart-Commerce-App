import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalInput from '../components/GlobalInput';
import GlobalButton from '../components/GlobalButton';
import { ROUTES } from '../routes/RoutesConstants';
import Snackbar from 'react-native-snackbar';
import { BaseurlSupplier } from '../Apis/apiConfig';
import BackButton from '../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';

export default function SupplierResetpassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Snackbar.show({
        text: 'Please enter email',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    } else if (!emailRegex.test(email)) {
      Snackbar.show({
        text: 'Please enter a valid email address',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    } else {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "email": email });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${BaseurlSupplier}forgot-password`, requestOptions)
        .then((response) => {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          } else {
            throw new Error('Invalid response from server');
          }
        })
        .then((result) => {
          console.log(result);
          if (result?.success === true) {
            navigation.navigate(ROUTES.SupplierOtp, { email: email });
          }
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });

          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          Alert.alert("Error", "Something went wrong. Please try again.");
        });
    }
  };

  return (
    <LinearGradient colors={[themeStyle.backgroundFirst, themeStyle.backgroundSecond]} style={styles.container}>

    <View style={styles.container}>
      <ScrollView>
        <BackButton/>
        <Header
          title={'Reset Password'}
          description={`Enter email address and a link to reset \n your password will be sent to you.`}
        />
        <GlobalInput
          title={'Email Address'}
          hint={'Enter your email address'}
          marginTop={'10%'}
          value={email}
          onChangeText={setEmail}
        />
        <GlobalButton
          onPress={handlePasswordReset}
          title={'Continue'}
          marginTop={'8%'}
          loading={loading}
        />
        <View style={styles.separator} />
      </ScrollView>
    </View>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  separator: {
    height: 20,
  },
});
