import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItemFromCart, updateItemQuantity } from '../redux/CartSlice';
import GlobalButton from '../components/GlobalButton';
import { GestureHandlerRootView, Swipeable, TextInput } from 'react-native-gesture-handler';
import { ROUTES } from '../routes/RoutesConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { BaseurlRestuarant, BaseurlSupplier } from '../Apis/apiConfig';
import { provinces } from '../data/province';
import { Picker } from '@react-native-picker/picker';
export default function Shipping({ navigation }) {
  const cartItems = useSelector(state => state.cart.items);

  const [loading, setloading] = useState(false);
  const [subTax, setSubTax] = useState(0);
  console.log(cartItems, "cartItems")
  const dispatch = useDispatch();
  const [supplierCount, setSupplierCount] = useState(0);
  const [address, setAddress] = useState('');
  // State to keep track of selected province (index value)
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(0);
  const [dbAddress,  setDbAddress] = useState();
  // Function to fetch restaurant address with token
  const fetchRestaurantAddress = async () => {
    try {
      const restaurantId = await AsyncStorage.getItem('restuarantId');
      const token = await AsyncStorage.getItem('restuarantToken');

      if (restaurantId && token) {
        // Fetch the restaurant data with Authorization header
        const response = await fetch(`${BaseurlRestuarant}/${restaurantId}`, {
          method: 'GET',
          headers: {
            'x-access-token': token, // Add token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        // Assuming the address field is in the `data` object
        if (data && data.shippingAddress) {
          setDbAddress(data.shippingAddress); // Store the fetched address for later use
          setAddress(data.shippingAddress); // Set the address automatically
        } else {
          Alert.alert('Error', 'Address not found');
        }
      } else {
        Alert.alert('Error', 'Restaurant ID or Token is missing');
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    // Fetch the restaurant data when the component mounts
    fetchRestaurantAddress();
  }, []);

  const handleProvinceChange = (itemValue, itemIndex) => {
    setSelectedProvinceIndex(itemIndex);
  };
  // Function to calculate the number of distinct suppliers,

  const extractNumber = (str) => {
    const match = str.match(/\d+/);
    return match ? match[0] : null;
  };

  const fetchSuppliersAndCalculateTax = async (supplierIds) => {
    try {
      const uniqueSupplierIds = [...new Set(supplierIds)]; // Ensure unique supplier IDs
      let totalTax = 0;

      for (const id of uniqueSupplierIds) {

        const response = await fetch(`${BaseurlSupplier}/${id}`);
        const json = await response.json();
        console.log("json", json)
        let selectedDeliveryOption = json?.selectedDeliveryOption;
        const deliveryOption = json?.deliveryOption;

        // console.log('options:',deliveryOption.byWeight);

        if (selectedDeliveryOption === "byWeight") {
          console.log('cartItem', cartItems)
          const totalWeight = cartItems
            .filter(item => item?.supplierId?._id === id) // Filter items from the current supplier
            .reduce((sum, item) => {
              const itemWeight = item.weight; // Extract numeric weight from item
              const itemTotalWeight = itemWeight * item.quantity; // Total weight = item weight * quantity
              return sum + itemTotalWeight; // Sum the total weights
            }, 0);
          console.log("total weight", totalWeight);
          let tax = deliveryOption?.byWeight || 0;
          tax = tax * totalWeight;
          totalTax += tax;
        } else {
          // Fallback if byWeight is not present
          const tax = deliveryOption?.flateRate || 0; // Default to 0 if flateRate is undefined
          totalTax += tax;
        }
      }
      console.log('total tax:', totalTax);
      setSubTax(totalTax); // Set the accumulated tax
    } catch (e) {
      console.log('Error fetching supplier...', e);
    }
  };


  const getSupplierIds = (items) => {
    return items.map(item => item?.supplierId?._id);
  };

  useEffect(() => {
    const supplierIds = getSupplierIds(cartItems);
    fetchSuppliersAndCalculateTax(supplierIds);
  }, [cartItems]);

  const incrementQuantity = (_id, quantity) => {
    dispatch(updateItemQuantity({ _id, quantity: quantity + 1 }));
  };

  const decrementQuantity = (_id, quantity) => {
    if (quantity > 1) {
      dispatch(updateItemQuantity({ _id, quantity: quantity - 1 }));
    } else if (quantity === 1) {
      dispatch(removeItemFromCart({ _id }));
    }
  };


  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const truncateTitle = (name, charLimit) => {
    if (name.length > charLimit) {
      return name.slice(0, charLimit) + '...';
    }
    return name;
  };

  const getTimeAgo = (timestamp) => {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);
    const diffInSeconds = Math.floor((currentTime - previousTime) / 1000);

    const intervals = {
      yr: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      min: 60,
    };

    let timeAgo = '';

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      if (interval >= 1) {
        timeAgo = `${interval}  ${unit}${interval !== 1 ? 's' : ''} ago`;
        break;
      }
    }

    if (!timeAgo) {
      timeAgo = 'Just now';
    }

    return timeAgo;
  };


  const placeOrder = async () => {
    setloading(true)
    const restuarantId = await AsyncStorage.getItem('restuarantId')
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const items = cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));

    const raw = JSON.stringify({
      restaurantId: restuarantId,
      items: items,
      shippingAddress: "123 Main St, Springfield, IL",
      billingAddress: "456 Elm St, Springfield, IL"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };



    try {
      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/order", requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      navigation.navigate(ROUTES.UserCheckout)
      setloading(false)
      dispatch(clearCart());
      Snackbar.show({
        text: 'Order Place Successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      // Alert.alert("Order placed successfully!", JSON.stringify(result));
    } catch (error) {
      console.error('There was an error placing the order:', error);
      setloading(false)
      // Alert.alert("Error", "Failed to place the order. Please try again.");
    }
  };

  // useEffect(() => {
  //   setSupplierCount(countDistinctSuppliers(cartItems)); // Update supplier count when cartItems change
  //   console.log('count:',countDistinctSuppliers(cartItems));
  // }, [cartItems]);

  useEffect(() => {
    console.log('cartData:', cartItems);
  }, [])


  const SwipeableItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity>
          <Image style={styles.icon} source={require('../../assets/images/Cart/edit.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(removeItemFromCart({ _id: item?._id }))} style={styles.deleteButton}>
          <Image style={styles.icon} source={require('../../assets/images/Cart/delete.png')} />
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.cartItemContainer}>
          <View style={styles.cartItemRow}>
            <View style={styles.imageContainer}>
              {
                item?.image?.url ? (
                  <Image resizeMode='contain' style={styles.cartItemImage} source={{ uri: item.image?.url }} />

                ) : (
                  <Image resizeMode='contain' style={styles.cartItemImage} source={{ uri: item.image }} />

                )
              }
            </View>
            <View>
              <Text style={styles.itemTitle}>
                {truncateTitle(item.name, 15)}
              </Text>
              <Text style={styles.itemQuantity}>{item.quantity}Kg</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decrementQuantity(item._id, item.quantity)} style={styles.decrementButton}>
                <Image tintColor={themeStyle.WHITE} style={styles.decrementIcon} source={require('../../assets/images/SingleItem/minus.png')} />
              </TouchableOpacity>
              <Text style={styles.itemQuantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(item._id, item.quantity)} style={styles.incrementButton}>
                <Image tintColor={themeStyle.WHITE} style={styles.incrementIcon} source={require('../../assets/images/SingleItem/plus.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemFooter}>
            <View style={styles.timeAgoContainer}>
              <Text style={styles.timeAgoText}>{getTimeAgo(item.timestamp)}</Text>
            </View>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };


  useEffect(() => {
    console.log('total:', total);
  }, []);

  const renderItem = ({ item }) => (
    <SwipeableItem item={item} />
  );
  const subTotal = calculateSubTotal();
  const tax = subTax;
  let total = tax + subTotal;
  let govtTax = (
    (provinces[selectedProvinceIndex].totalRate / 100) *
    (total)
  ).toFixed(2);

  total = total + Number(govtTax);
  return cartItems?.length === 0 ? (
    <>
      <StatusBar backgroundColor={themeStyle.PRIMARY_COLOR} />
      <View style={styles.MainNoCart}>
        <Image
          source={require('../../assets/images/Cart/basket.png')}
          style={styles.noCartImage}
        />
        <Text style={styles.NoCartTitle}>
          Hungry!!
        </Text>
        <Text style={styles.NoCartText}>
          No items in You Cart
        </Text>
        <GlobalButton
          onPress={() => navigation.goBack()}
          marginTop={'8%'}
          title={'Browse'}
        />
      </View>

    </>
  ) :
    (
      <>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Address</Text>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                value={address}
                onChangeText={(text) => setAddress(text)}
              />

              <Text style={styles.label}>Province:</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={selectedProvinceIndex}
                  onValueChange={handleProvinceChange}
                  style={styles.picker}
                >
                  {provinces.map((province, index) => (
                    <Picker.Item key={index} label={province.name} value={index} />
                  ))}
                </Picker>
              </View>
              {dbAddress !== address &&
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Use This Address</Text>
                </TouchableOpacity>
              }
            </View>
            {/* <View style={styles.productsHeader}>
              <Text style={styles.productsTitle}>Products</Text>
              <Text style={styles.productsCount}>Total {cartItems?.length} Pieces</Text>
            </View> */}
            {/* <GestureHandlerRootView style={styles.listContainer}>
              <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </GestureHandlerRootView> */}
            <Text style={styles.billSummaryTitle}>Bill Summary</Text>
            <View style={styles.billSummaryContainer}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.billItem}>
                  <Text style={styles.billItemText}>{`${item.name} (${item.weight}kg x ${item.quantity})`}</Text>
                  <Text style={styles.billItemPrice}>${item.price * item.quantity}</Text>
                </View>
              ))}
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Shipping</Text>
                <Text style={styles.billItemPrice}>${tax}</Text>
              </View>
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Tax</Text>
                <Text style={styles.billItemPrice}>
                  <Text style={styles.percentageText}>({provinces[selectedProvinceIndex].totalRate}%)</Text> ${govtTax}
                </Text>
              </View>

              <View style={styles.dashedSeparator} />
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Sub Total</Text>
                <Text style={styles.subTotalPrice}>${total.toFixed(2)}</Text>
              </View>
            </View>
            <GlobalButton loading={loading} onPress={() => navigation.navigate(ROUTES.UserPaymentDetails, { item: cartItems, total: total, address: address, govtTax: govtTax })} marginTop={'5%'} title={'Checkout'} />
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 12, // Smaller font size for the percentage
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    color: '#000',
    borderRadius: 5,
  },
  button: {
    backgroundColor: themeStyle.PRIMARY_COLOR, // Button background color
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
    width: 150, // Set a specific width for the button
    alignSelf: 'start', // Center the button horizontally
  },
  buttonText: {
    color: '#FFFFFF', // Button text color
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    color: '#000',
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  rightActionsContainer: {
    marginTop: '5%',
  },
  deleteButton: {
    marginTop: '30%',
  },
  icon: {
    height: 37,
    width: 37,
  },
  cartItemContainer: {
    height: 106,
    width: '99%',
    backgroundColor: themeStyle.HOME_ITEM,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',

  },
  cartItemRow: {
    flexDirection: 'row',
    marginTop: 20
  },
  imageContainer: {
    height: 77,
    width: 77,
    backgroundColor: themeStyle.WHITE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    right: 10

  },
  cartItemImage: {
    width: 46,
    height: 38,
  },
  itemTitle: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 16,

  },
  itemQuantity: {
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    left: '12%',
  },
  decrementButton: {
    height: 20,
    width: 20,
    backgroundColor: themeStyle.TEXT_GREY,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    left: 5,
  },
  decrementIcon: {
    width: 5,
    height: 1,
  },
  itemQuantityText: {
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
    marginLeft: '10%',
  },
  incrementButton: {
    height: 20,
    width: 20,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '10%',
    right: 5,
  },
  incrementIcon: {
    width: 6,
    height: 6,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginLeft: 'auto',
    right: 10,
    bottom: 25,
  },
  timeAgoContainer: {
    height: 17,
    width: 47,
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeAgoText: {
    fontSize: 6,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  itemPrice: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
  },
  header: {
    height: 70,
    backgroundColor: themeStyle.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5
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
    marginLeft: '30%',
    fontFamily: FONT.ManropeSemiBold,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  productsTitle: {
    fontSize: 20,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },
  productsCount: {
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '5%'
  },
  billSummaryTitle: {
    fontSize: 20,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
    marginLeft: '5%',
  },
  billSummaryContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: themeStyle.HOME_ITEM,
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  billItemText: {
    fontSize: 16,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  billItemPrice: {
    fontSize: 16,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },
  dashedSeparator: {
    height: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderStyle: 'dashed',
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  subTotalPrice: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
  },
  bottomSpacer: {
    height: 100,
  },

  MainNoCart: {
    // paddingTop: '30%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },

  noCartImage: {
    height: 218,
    width: 218
  },

  NoCartHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },

  NoCartText: {
    textAlign: 'center',
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginTop: "3%",
    fontSize: 20
  }, NoCartTitle: {
    textAlign: 'center',
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginTop: "3%",
    fontSize: 15
  }
});
