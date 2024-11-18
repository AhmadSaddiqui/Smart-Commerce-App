import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import themeStyle from '../styles/themeStyle';

export default function PrivacyPolicy({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.sectionText}>
          This Privacy Policy explains how we collect, use, and protect your information when you use our application. By accessing or using our services, you agree to the terms outlined in this policy.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.sectionText}>
          We may collect personal information such as your name, email address, and location data. This information is used to provide and improve our services, personalize your experience, and communicate with you.
        </Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.sectionText}>
          Your information is used to enhance your user experience, respond to customer service requests, and send you updates about our services. We do not share your personal information with third parties except as required by law.
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.sectionText}>
          We take data security seriously and implement appropriate measures to protect your information from unauthorized access, disclosure, or misuse.
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.sectionText}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our application.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have any questions or concerns about this Privacy Policy, please contact us at [support@example.com].
        </Text>
        <View style={{height:100}}/>
      </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: themeStyle.PRIMARY_COLOR,
  },
  sectionText: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
});
