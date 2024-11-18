import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProductAlerts({ navigation }) {
  const alertsData = [
    { id: '1', title: 'New Product Launch', description: 'Check out our latest product now available!', alertDate: '01 Aug, 2024' },
    { id: '2', title: 'Price Drop on Popular Items', description: 'Prices have dropped on some of our most popular items.', alertDate: '15 Aug, 2024' },
    { id: '3', title: 'Limited Stock Alert', description: 'Hurry up! Limited stock available for select products.', alertDate: '20 Aug, 2024' },
    { id: '4', title: 'Seasonal Sale Starts', description: 'Our seasonal sale is now live. Don\'t miss out on great deals!', alertDate: '01 Sep, 2024' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Alerts</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {alertsData.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
            </View>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            <Text style={styles.alertDate}>Alert Date: {alert.alertDate}</Text>
            {/* <TouchableOpacity style={styles.viewDetailButton}>
              <Text style={styles.viewDetailText}>View Details</Text>
            </TouchableOpacity> */}
          </View>
        ))}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '23%',
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  alertCard: {
    backgroundColor: 'rgba(223, 223, 223, 0.08)',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.2,
  },
  alertHeader: {
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  alertDescription: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 16,
  },
  viewDetailButton: {
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewDetailText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
