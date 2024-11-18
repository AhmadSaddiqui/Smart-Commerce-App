import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming you have Ionicons installed
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useFocusEffect } from '@react-navigation/native';
import Empty from '../components/Empty';
import { BaseurlOrder } from '../Apis/apiConfig';
import { ROUTES } from '../routes/RoutesConstants';

export default function SupplierOrderManagement({ navigation }) {
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const statuses = ['Delivered', 'Pending', 'Approved', 'Rejected', 'Shipped'];





  const fetchOrders = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    try {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };

      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/order/orders-by-supplier/${supplierId}`, requestOptions);
      const result = await response.json();
      console.log(response, 'response')
      setOrders(result);
      console.log(result, 'orrrrrrrrrr')
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };



  useFocusEffect((
    useCallback(() => {
      fetchOrders();

    }, [])
  ))


  const updateOrderStatus = async (orderId, status) => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const raw = JSON.stringify({ status });

    const requestOptions = {
      method: "PATCH",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BaseurlOrder}update-status/${supplierId}/${orderId}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result, '=========')
      fetchOrders()
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: status } : order
          )
        );
        Snackbar.show({
          text: `Order status updated to ${status}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
        });
      } else {
        console.error('Failed to update status:', result);
        Snackbar.show({
          text: `Failed to update status`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#E53935',
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Snackbar.show({
        text: 'Error updating status',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#E53935',
      });
    }
  };

  const toggleDropdown = (orderId) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const selectStatus = (status) => {
    setSelectedStatus({ ...selectedStatus, [selectedOrderId]: status });
    setModalVisible(false);
    updateOrderStatus(selectedOrderId, status);
  };



  const renderItemChunk = ({ item }) => (
    <View style={{ width: 333, backgroundColor: themeStyle.WHITE, alignSelf: 'center', marginTop: '5%' }}>
      <TouchableOpacity onPress={() => toggleDropdown(item.orderId)} style={styles.statusContainer}>
        <Text style={styles.statusText}>{selectedStatus[item._id] || 'Change Status'}</Text>
        <Ionicons name="chevron-down-outline" size={16} color="#4CAF50" />
      </TouchableOpacity>

      <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, marginLeft: '5%', marginTop: '5%' }}>Order ID: {item._id}</Text>
      <Text style={{ fontSize: 18, color: themeStyle.BLACK, marginLeft: '5%', marginTop: '2%' }}>Customer: {item?.restaurantId?.name}</Text>
      <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, marginLeft: '5%', marginTop: '2%' }}>Total Amount: <Text style={{ color: themeStyle.BLACK }}>{item.totalAmount}</Text></Text>
      <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, marginLeft: '5%', marginTop: '2%' }}>Order Date: <Text style={{ color: themeStyle.BLACK }}>{new Date(item.orderDate).toLocaleDateString()}</Text></Text>

      {item?.items?.map((itemDetail, index) => (
        <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, marginLeft: '5%', marginTop: '2%' }}>Item {index + 1}: <Text style={{ color: themeStyle.BLACK }}>{itemDetail?.productId?.name} x {itemDetail?.quantity}</Text></Text>


      ))}

      <View style={{ height: 33, width: 97, backgroundColor: item.status === 'Pending' ? 'rgba(240, 240, 240, 1)' : item.status === 'Completed' ? 'rgba(244, 255, 242, 1)' : 'rgba(230, 47, 57, 0.05)', marginLeft: '5%', marginTop: '5%', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: FONT.ManropeMedium, color: item.status === 'Pending' ? 'rgba(113, 113, 113, 1)' : item.status === 'Completed' ? 'rgba(26, 189, 0, 1)' : 'rgba(230, 47, 57, 1)' }}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Management</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SupplierEditProfile)}>
            <Image style={{ height: 31, width: 31, marginLeft: 'auto', marginRight: '15%', borderRadius: 20 }} source={require('../../assets/images/Splash/dp.png')} />
          </TouchableOpacity>
        </View>

        {
          orders?.length == 0 ? (
            <Empty otherViews={
              <Image style={{ width: 240, height: 240 }} source={require('../../assets/images/Cart/EmptyCartOrder.png')} resizeMode='contain' />
            } />
          ) : (
            <FlatList
              data={orders}
              renderItem={renderItemChunk}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.chunkListContainer}
            />

          )
        }
        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Modal for changing status */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {statuses.map((status) => (
              <TouchableOpacity key={status} onPress={() => selectStatus(status)} style={styles.modalOption}>
                <Text style={styles.modalText}>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  addressContainer: {
    flexDirection: 'row',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    width: 12,
    height: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  downIcon: {
    width: 10,
    height: 8,
    marginLeft: '5%',
  },
  address: {
    fontSize: 16,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '10%',
  },
  dpIcon: {
    height: 31,
    width: 31,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 51,
    width: '85%',
    backgroundColor: themeStyle.LIGHT_GREY,
    marginRight: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '8%',
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginLeft: 10,
  },
  searchInput: {
    paddingLeft: 20,
    color: themeStyle.BLACK,
    width: '85%',
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  categoriesTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  leftArrow: {
    marginLeft: 'auto',
    left: 75,
  },
  rightArrow: {
    marginLeft: 'auto',
    marginRight: '5%',
  },
  arrowIcon: {
    height: 19,
    width: 19,
    marginLeft: '5%'
  },
  flatListContainer: {
    paddingHorizontal: 10,
    marginTop: '5%',
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 57,
    height: 57,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  chunkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  chunkTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  viewAll: {
    marginLeft: '55%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  chunkListContainer: {
    paddingHorizontal: 10,
    marginTop: '5%',
  },
  chunkItem: {
    height: 218,
    width: 158,
    backgroundColor: themeStyle.bgcItem,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    marginTop: '5%',
  },
  chunkImageContainer: {
    height: 107,
    width: 107,
    backgroundColor: themeStyle.WHITE,
    alignSelf: 'center',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chunkImage: {
    height: 56,
    width: 86,
  },
  chunkTitle: {
    fontSize: 14,
    fontFamily: FONT.ManropeSemiBold,
    marginTop: '5%',
    marginLeft: '5%',
    color: themeStyle.BLACK,
  },
  chunkPrice: {
    fontSize: 12,
    fontFamily: FONT.ManropeBold,
    marginTop: '0%',
    marginLeft: '5%',
    color: themeStyle.PRIMARY_COLOR,
  },
  chunkPriceUnit: {
    fontSize: 8,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  chunkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '5%',
  },
  heartButton: {
    height: 28,
    width: 28,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  heartIcon: {
    width: 12,
    height: 15,
    top: 2
  },
  cartButton: {
    height: 28,
    width: 97,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 5,
    marginLeft: '5%',
    alignItems: 'center',
    borderWidth: 1
  },
  cartIcon: {
    width: 10,
    height: 8.75,
  },
  cartText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    top: 5
  },
  footerSpace: {
    height: 80,
  },
  container1: {
    height: 105,
    width: 160,
    backgroundColor: themeStyle.PINK,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
  },
  totalSalesText: {
    fontSize: 12,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeSemiBold,
  },
  handImage: {
    height: 32,
    width: 32,
  },
  amountText: {
    fontSize: 24,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
    marginLeft: '5%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '5%',
  },
  pathImage: {
    height: 6,
    width: 11,
  },
  percentageText: {
    fontSize: 8,
    color: themeStyle.GREEN,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  upFromText: {
    fontSize: 8,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  header: {
    height: 70,
    backgroundColor: themeStyle.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: '8%',
  },
  backIcon: {
    width: 24,
    height: 28,
  },
  headerTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    marginLeft: '15%',
    fontFamily: FONT.ManropeSemiBold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: '5%',
  },
  statusText: {
    fontSize: 16,
    fontFamily: FONT.ManropeMedium,
    color: '#4CAF50',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for a more dramatic effect
  },
  modalContent: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 15, // More rounded corners
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10, // Add shadow for Android
  },
  modalOption: {
    paddingVertical: 12,
    width: '100%',
    backgroundColor: '#f5f5f5', // Light background for options
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalText: {
    fontSize: 18,
    fontFamily: FONT.ManropeBold, // Use a bold font for emphasis
    color: themeStyle.BLACK,
  },
  modalCancel: {
    marginTop: 20,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalCancelText: {
    fontSize: 18,
    fontFamily: FONT.ManropeBold, // Bold font for the cancel button
    color: 'white',
  },

});
