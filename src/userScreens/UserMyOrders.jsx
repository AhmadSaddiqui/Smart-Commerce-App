import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, Modal, Button } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { useDispatch, useSelector } from 'react-redux';
import GlobalButton from '../components/GlobalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { addItemToCart } from '../redux/CartSlice';
import Empty from '../components/Empty';
import { BaseurlOrder } from '../Apis/apiConfig';

export default function UserFavourites() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const cartItems = useSelector(state => state.cart.items);
  console.log(cartItems, '---')

  const fetchOrderHistory = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    const buyerToken = await AsyncStorage.getItem('buyerToken');
    const requestOptions = {
      method: "GET",
      headers: {
        "x-access-token": buyerToken,  // Include the token in the Authorization header
        "Content-Type": "application/json"  // Assuming JSON format
      },
      redirect: "follow"
    };

    try {
      const response = await fetch(`${BaseurlOrder}/history/${buyerId}`, requestOptions);
      const result = await response.json();
      if (result?.message === 'No orders found for this buyer.') {
        setProducts([]);
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
  );

  const truncateTitle = (title, charLimit) => {
    if (title?.length > charLimit) {
      return title.slice(0, charLimit) + '...';
    }
    return title;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.cartItemContainer}>
        <View style={styles.cartItemRow}>
          <View>
            {item?.items?.map((product, index) => (
              <View key={index} style={styles.itemDetails}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: product?.productId?.image?.url.replace('localhost', '10.0.2.2') }}
                    style={styles.productImage}
                  />
                </View>
                <Text style={styles.itemTitle}>{truncateTitle(product?.productId?.name, 15)}</Text>
                <Text style={styles.itemQuantity}>Quantity : {product.quantity}</Text>
                <Text style={styles.itemQuantity}>Price : ${product.price}</Text>
              </View>
            ))}
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>Total Amount</Text>
          <Text style={styles.itemPrice}>${item.totalAmount} | {item.items.length} Items</Text>
        </View>
        <View style={styles.buttonsRow}>
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
                  "category": item?.productId?.category,
                  "description": "",
                  "image": item?.productId?.image?.url,
                  "name": item?.productId?.name,
                  "price": item?.price,
                  "status": item?.status,
                  "subcategory": "",
                  "supplierId": item?.supplierId._id,
                  "weight": "",
                  "quantity": item?.quantity,
                };
                dispatch(addItemToCart(transformedItem));
                navigation.navigate('UserCart');
              });
            }}
            style={styles.cartButton}
            otherStyles={{
              width: '45%',
              backgroundColor: themeStyle.PRIMARY_COLOR,
              borderWidth: 1,
            }}
            textOtherStyle={{
              color: themeStyle.WHITE,
            }}
            height={40}
            title={'Re Order Now'}
          />
        </View>
      </View>
    );
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      {selectedOrder && (
        <>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>{new Date(selectedOrder?.orderDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Shipping Address:</Text>
            <Text style={styles.detailValue}>{selectedOrder?.shippingAddress}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Billing Address:</Text>
            <Text style={styles.detailValue}>{selectedOrder?.billingAddress}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.detailValue}>${selectedOrder?.totalAmount}</Text>
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

  return (
    <View style={styles.container}>
      {
        products?.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Orders</Text>
            </View>
            <Empty
              otherViews={
                <Image resizeMode='contain' style={styles.emptyImage} source={require('../../assets/images/Cart/UserCartEmpty.png')} />
              }
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.flatList}
            />
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
    backgroundColor: themeStyle.BACKGROUND_COLOR, // Soft background color
    paddingHorizontal: 20,
  },
  header: {
    height: 80,
    backgroundColor: themeStyle.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  backIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
  },
  cartItemContainer: {
    backgroundColor: themeStyle.WHITE,
    borderRadius: 12,
    borderColor: themeStyle.LIGHT_GREY,
    borderWidth: 1,
    marginVertical: 10,
    padding: 15,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cartItemRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
  imageContainer: {
    height: 80,
    width: 80,
    backgroundColor: themeStyle.LIGHT_GREY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemTitle: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 16,
    marginBottom: 5,
  },
  itemQuantity: {
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    fontSize: 14,
    marginBottom: 5,
  },
  statusContainer: {
    backgroundColor: themeStyle.STATUS_BG,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
    justifyContent: 'center',
  },
  statusText: {
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.STATUS_COLOR,
    fontSize: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: FONT.ManropeBold,
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewDetailsButton: {
    backgroundColor: themeStyle.LIGHT_GREY,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetails: {
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
    fontSize: 16,
  },
  cartButton: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scrollView: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    height: 220,
    width: 220,
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
    width: '80%',
    backgroundColor: themeStyle.WHITE,
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginBottom: 15,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
  itemsTitle: {
    fontSize: 16,
    fontFamily: FONT.ManropeBold,
    color: themeStyle.BLACK,
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
  },
});
