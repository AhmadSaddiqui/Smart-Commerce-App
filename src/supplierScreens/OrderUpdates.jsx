import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OrderUpdates({ navigation }) {
  const [selectedStatus, setSelectedStatus] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const orderData = [
    { id: '94575', date: '13 Jan, 2024, 8:35 PM', amount: '134.00', items: 3 },
    { id: '94576', date: '13 Jan, 2024, 8:35 PM', amount: '134.00', items: 3 },
    { id: '94577', date: '13 Jan, 2024, 8:35 PM', amount: '134.00', items: 3 },
    { id: '94578', date: '13 Jan, 2024, 8:35 PM', amount: '134.00', items: 3 },
  ];

  const statuses = ['Delivered', 'Canceled', 'Accepted', 'Completed'];

  const toggleDropdown = (orderId) => {
    setDropdownVisible(dropdownVisible === orderId ? null : orderId);
  };

  const selectStatus = (orderId, status) => {
    setSelectedStatus({ ...selectedStatus, [orderId]: status });
    setDropdownVisible(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Updates</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {orderData.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.restaurantName}>Restaurant Name</Text>
              <TouchableOpacity onPress={() => toggleDropdown(order.id)} style={styles.statusContainer}>
                <Text style={styles.statusText}>{selectedStatus[order.id] || 'Delivered'}</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            <Text style={styles.orderInfo}>Order ID:{order.id}</Text>
            <Text style={styles.orderInfo}>{order.date}</Text>
            <Text style={styles.orderAmount}>$ {order.amount} | {order.items} items</Text>
            <TouchableOpacity style={styles.viewDetailButton}>
              <Text style={styles.viewDetailText}>View Detail</Text>
            </TouchableOpacity>
            {dropdownVisible === order.id && (
              <View style={styles.dropdown}>
                {statuses.map((status, idx) => (
                  <TouchableOpacity key={idx} onPress={() => selectStatus(order.id, status)} style={styles.dropdownItem}>
                    <Text style={styles.dropdownText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    marginRight: 4,
  },
  orderInfo: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
    color: '#757575',
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
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#757575',
  },
});
