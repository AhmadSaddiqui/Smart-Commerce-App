import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import themeStyle, { FONT } from '../styles/themeStyle';

export default function CategoryDropDown({ title, hint, marginTop, width,onSelectCategory,options }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  // const options = ['Beef', 'Chicken', 'Mutton','Lamb','Seafood']; // Example options array

  const handleOptionSelect = (option) => {
    setSelectedOption(option?.name);
    setShowOptions(false); // Hide options after selection
    onSelectCategory(option); // Call the callback function with the selected option
  };


  return (
    <View style={[styles.container, { marginTop: marginTop, width: width }]}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity
        onPress={() => setShowOptions(true)}
        style={[styles.input, { justifyContent: 'center', paddingLeft: 20, }]}
      >
        <Text style={{ color: themeStyle.BLACK }}>
          {selectedOption || hint} {/* Show selected option or hint */}
        </Text>
        <Image resizeMode='contain' style={{position:'absolute',height:20,width:20,right:20}} source={require('../../assets/images/Cart/down.png')}/>
      </TouchableOpacity>

      {/* Modal for options */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText}>{option?.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '5%',
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
  input: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    height: 50,
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    width:'100%'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: themeStyle.WHITE,
    width: '80%',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeStyle.TEXT_GREY,
  },
  optionText: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
});
