import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import themeStyle, { FONT } from '../styles/themeStyle';
import ImagePicker from 'react-native-image-crop-picker'; // Import image picker library
import GlobalButton from '../components/GlobalButton';

export default function BulkOrder({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpload = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      console.log(image);
      setSelectedImage(image.path);
    }).catch(error => {
      console.log('Error selecting image:', error);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bulk Order</Text>
        </View>
        <Text style={{ fontSize: 14, fontFamily: FONT.ManropeRegular, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '8%' }}>
          Upload Bulk Order Spreadsheet
        </Text>

        <TouchableOpacity onPress={handleUpload}>
          {selectedImage ? (
            <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={{ uri: selectedImage }} />
          ) : (
            <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={require('../../assets/images/Payment/upload.png')} />
          )}
        </TouchableOpacity>

        <GlobalButton marginTop={'5%'} title={'Continue'} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
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
    width: '95%',
    backgroundColor: themeStyle.HOME_ITEM,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',
  },
  cartItemRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    height: 77,
    width: 77,
    backgroundColor: themeStyle.WHITE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    right:10

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
    marginLeft: '23%',
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
    alignItems: 'center',
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
    color:  themeStyle.BLACK,
    fontFamily:FONT.ManropeSemiBold,  
},

NoCartText: {
    textAlign: 'center',
    color:  themeStyle.TEXT_GREY,
    fontFamily:FONT.ManropeRegular,
    marginTop:"3%",
    fontSize:20
},
});
