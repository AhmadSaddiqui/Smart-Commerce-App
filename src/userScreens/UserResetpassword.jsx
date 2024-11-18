import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalInput from '../components/GlobalInput';
import GlobalButton from '../components/GlobalButton';
import { ROUTES } from '../routes/RoutesConstants';
import { Baseurl, BaseurlRestuarant } from '../Apis/apiConfig';
import Snackbar from 'react-native-snackbar';
import BackButton from '../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';

export default function UserResetpassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setloading] = useState(false)


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
      setloading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "email": email });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${BaseurlRestuarant}forgot-password`, requestOptions)
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
            navigation.navigate(ROUTES.UserOtp, { email: email });
          }
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });

          setloading(false);
        })
        .catch((error) => {
          console.error(error);
          setloading(false);
          Alert.alert("Error", "Something went wrong. Please try again.");
        });
    }
  };


  return (
    <LinearGradient colors={[themeStyle.backgroundFirst, themeStyle.backgroundSecond]} style={styles.container}>

      <View style={styles.container}>
        <ScrollView>
          <BackButton />
          <Header title={'Reset Password'} description={`Enter email address and a link to reset \n your password will be sent to you.`} />
          <GlobalInput
            title={'Email Address'}
            hint={'Enter your email address'}
            marginTop={'10%'}
            value={email}
            onChangeText={setEmail}
          />
          <GlobalButton loading={loading} onPress={handlePasswordReset} title={'Continue'} marginTop={'8%'} />
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '6%',
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickBox: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  tickImage: {
    height: 7,
    width: 10,
  },
  rememberText: {
    fontSize: 16,
    color: themeStyle.MEDIUM_BLACK,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  forgotText: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '40%',
  },
  signUpText: {
    fontSize: 16,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  signUpLink: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  footerText: {
    fontSize: 12,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
    alignSelf: 'center',
    marginTop: '15%',
  },
  separator: {
    height: 20
  }
})
