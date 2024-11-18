import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, Modal, Button } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { useDispatch, useSelector } from 'react-redux';
import GlobalButton from '../components/GlobalButton';
import GlobalButton2 from '../components/GlobalButton2';
import GlobalButton3 from '../components/GlobalButton3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { addItemToCart } from '../redux/CartSlice';
import Empty from '../components/Empty';

export default function UserFavourites() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const cartItems = useSelector(state => state.cart.items);
  console.log(cartItems, '---')


  const fetchOrderHistory = async () => {
    const restuarantId = await AsyncStorage.getItem('restuarantId')
    const restaurantToken = await AsyncStorage.getItem('restuarantToken');
    const requestOptions = {
      method: "GET",
      headers: {
        "x-access-token": restaurantToken,  // Include the en in the Authorization header
        "Content-Type": "application/json"  // Assuming JSON format
      },
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/order/history/${restuarantId}`, requestOptions);

      const result = await response.json();
      console.log(result, 'myorders')
      if (result?.message == 'No orders found for this restaurant.') {
        setProducts([])
      } else {
        setProducts(result); // Adjust based on the response structure
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };



  useFocusEffect(
    useCallback(() => {
      fetchOrderHistory();
    }, [])
  )

  const truncateTitle = (title, charLimit) => {
    if (title?.length > charLimit) {
      return title.slice(0, charLimit) + '...';
    }
    return title;
  };

  const renderItem = ({ item }) => {
    console.log('Print item', item?.items);

    return (
      <View style={styles.cartItemContainer}>
        <View style={styles.cartItemRow}>
          <View style={styles.imageContainer}>
            <Image resizeMode='contain' style={styles.cartItemImage} source={{ uri: 'https://media.istockphoto.com/id/935316446/photo/fresh-raw-rib-eye-steaks-isolated-on-white.jpg?s=612x612&w=0&k=20&c=UBnLccI6y47Vynuxa2BybZS0jPUtEqpJvL4LzVgGSOg=' }} />
          </View>
          <View>
            {item?.items?.map((product, index) => (
              <View key={index}>
                <Text style={styles.itemTitle}>
                  {truncateTitle(product?.productId?.name, 15)}
                </Text>
                <Text style={styles.itemQuantity}>Quantity : {product.quantity}</Text>
                <Text style={styles.itemQuantity}>Price : {product.price}</Text>
              </View>
            ))}
            {/* <Text style={[styles.itemQuantity, { marginTop: '1%' }]}>
              Deliver Date : {new Date(item.orderDate).toLocaleDateString()}
            </Text> */}
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>Total Amount</Text>
          <Text style={styles.itemPrice}>${item.totalAmount} I {item.items.length}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TouchableOpacity onPress={() => {
            setSelectedOrder(item);
            setModalVisible(true);
          }} style={styles.viewDetailsButton}>
            <Text style={styles.viewDetails}>View Details</Text>
          </TouchableOpacity>
          <GlobalButton
            onPress={() => {
              item?.items?.forEach(item => {
                const transformedItem = {
                  "_id": item?.productId?._id,
                  "category": item?.productId?.category, // Manually setting the value
                  "description": "", // Manually setting the value
                  "image": "https://media.istockphoto.com/id/935316446/photo/fresh-raw-rib-eye-steaks-isolated-on-white.jpg?s=612x612&w=0&k=20&c=UBnLccI6y47Vynuxa2BybZS0jPUtEqpJvL4LzVgGSOg=", // Manually setting the value
                  "name": item?.productId?.name, // Manually setting the value
                  "price": item?.price, // Manually setting the value
                  "status": item?.status, // Manually setting the value
                  "subcategory": "", // Manually setting the value
                  "supplierId": item?.supplierId._id,
                  "weight": "", // Manually setting the value
                  "quantity": item?.quantity, // Keeping the original quantity
                };

                dispatch(addItemToCart(transformedItem));
                navigation.navigate('UserCart');
              });

              // Optional: Navigate to the UserCart screen after adding items to the cart

            }}
            style={styles.cartButton}
            otherStyles={{
              width: '45%',
              backgroundColor: 'transparent',
              borderColor: themeStyle.PRIMARY_COLOR,
              borderWidth: 1,
            }}
            textOtherStyle={{
              color: themeStyle.PRIMARY_COLOR,
            }}
            height={40}
            title={'Re Order Now'}
          />
        </View>

      </View>
    )
  };
  const renderModalContent = () => (
    <View style={styles.modalContent}>
      {selectedOrder && (
        <>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={[styles.detailValue, { width: 100 }]}>{new Date(selectedOrder?.orderDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Shipping Address:</Text>
            <Text style={[styles.detailValue, { width: 100 }]}>{selectedOrder?.shippingAddress}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Billing Address:</Text>
            <Text style={[styles.detailValue, { width: 100 }]}>{selectedOrder?.billingAddress}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={[styles.detailValue, { width: 100 }]}>${selectedOrder?.totalAmount}</Text>
          </View>
          <Text style={styles.itemsTitle}>Items:</Text>
          {selectedOrder?.items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemText}>- {item?.productId?.name} (Qty: {item?.quantity}, Price: ${item?.price})</Text>
            </View>
          ))}
          <Button title="Close" onPress={() => setModalVisible(false)} color={themeStyle.PRIMARY_COLOR} />
        </>
      )}
    </View>
  );

  console.log('products ==>', products);

  return (
    <View style={styles.container}>
      {
        products?.length == 0 ? (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Products</Text>
            </View>
            <Empty
              otherViews={
                <Image resizeMode='contain' style={{ height: 220, width: 220 }} source={require('../../assets/images/Cart/UserCartEmpty.png')} />
              }
            />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ paddingBottom: '15%' }}
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
            </View>
            {/* <GlobalButton3 marginTop={'5%'} height={40} title={'Bulk Order'} /> */}

            <View style={styles.bottomSpacer} />
          </ScrollView>

        )
      }
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.WHITE,
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
    marginLeft: '25%',
    fontFamily: FONT.ManropeSemiBold,
  },
  cartItemContainer: {
    height: 220,
    width: '94%',
    backgroundColor: themeStyle.WHITE,
    borderRadius: 10,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    alignSelf: 'center',
    marginTop: '6%',
    justifyContent: 'center',
    elevation: .5
  },
  cartItemRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    height: 80,
    width: 80,
    elevation: .5,
    backgroundColor: themeStyle.WHITE,
    borderColor: themeStyle.bgcItem,
    borderWidth: .5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    right: 10,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  itemTitle: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 16,
  },
  itemQuantity: {
    fontFamily: FONT.ManropeBold,
    color: themeStyle.TEXT_GREY,
    fontSize: 12,
  },
  statusContainer: {
    marginLeft: 'auto',
    marginRight: '5%',
    backgroundColor: 'rgba(221, 254, 225, 1)',
    width: 61,
    height: 22,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(0, 149, 15, 1)',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '5%',
    // bottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: FONT.ManropeBold,
    color: themeStyle.TEXT_GREY,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeStyle.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    width: '45%',
  },
  viewDetails: {
    fontSize: 18,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
  },
  bottomSpacer: {
    height: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: themeStyle.WHITE,
    padding: 20,
    borderRadius: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT.ManropeSemiBold,
    marginBottom: 10,
    color: themeStyle.BLACK
  },
  modalDetail: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    marginBottom: 5,
    color: themeStyle.TEXT_GREY

  },
  modalContent: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555555',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#333333',
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333333',
  },
  itemContainer: {
    paddingVertical: 5,
    bottom: 10
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
  },
});
