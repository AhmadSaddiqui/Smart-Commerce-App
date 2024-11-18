import { Image, Text, View, ScrollView, TouchableOpacity, TextInput, ToastAndroid, StyleSheet, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { customtimer } from '../components/Customtime'
import themeStyle, { FONT } from '../styles/themeStyle'
import AuthHeader from '../components/AuthHeader'
import GlobalButton from '../components/GlobalButton'
import Header from '../components/Header'
import { ROUTES } from '../routes/RoutesConstants'


const SupplierOtp = () => {
    const route = useRoute()
    const [modalVisible, setModalVisible] = useState(false);
    const email = route.params?.email
    const navigation = useNavigation();
    const [focusedInput, setFocusedInput] = useState(null);
    const [second, setSecond] = useState(25)
    const [minute, setMinute] = useState(1)
    const [loading, setloading] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '']);
    const refs = useRef([
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ]);
    const validateOtp = otp => /^\d{4}$/.test(otp.join(''));
    const handleChangeText = (index, value) => {
        if (/[^0-9]/.test(value)) return; // If non-numeric character, do nothing
        otp[index] = value;
        if (index < otp.length - 1 && value !== '') {
            // Focus the next field if it's not the last one
            refs.current[index + 1].current.focus();
        }
        setOtp([...otp]);
    };
    const handleInputFocus = index => {
        setFocusedInput(index);
    };
    const handleInputBlur = () => {
        setFocusedInput(null);
    }
    useEffect(() => {
        const timer = setInterval(() => {
            if (minute === 0 && second === 0) {
                clearInterval(timer);
            } else if (second === 0) {
                setMinute(prevMinute => prevMinute - 1);
                setSecond(59);
            } else {
                setSecond(prevSecond => prevSecond - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [minute, second]);


  



    return (
        <View style={{flex:1,backgroundColor:themeStyle.PRIMARY_LIGHT}}>
        <ScrollView >
      
      <Header title={'OTP Verification'} description={`Enter the code from this sms we sent \n to +92 545545 77`}/>
      <Text style={{fontSize:18,color:themeStyle.PRIMARY_COLOR,alignSelf:'center',marginTop:'5%',fontFamily:FONT.ManropeRegular}} >{customtimer(minute, second)}</Text>

 <View style={{flexDirection:'row',alignSelf:"center",marginTop:'5%'}}>
 {otp.map((d, i) => (
                    <TextInput
                        key={i}
                        style={[styles.input, focusedInput === i && styles.inputFocused]}
                        placeholderTextColor={themeStyle.BLACK}
                        keyboardType="numeric"
                        value={d}
                        maxLength={1}
                        cursorColor={themeStyle.BLACK}
                        onChangeText={value => handleChangeText(i, value)}
                        onFocus={() => handleInputFocus(i)}
                        onBlur={handleInputBlur}
                        ref={refs.current[i]}
                    />
                ))}
 </View>

 <View style={{flexDirection:'row',alignItems:"center",alignSelf:'center'}}>
 <Text style={{fontSize:16,color:themeStyle.TEXT_GREY,alignSelf:'center',marginTop:'5%',fontFamily:FONT.ManropeRegular}} >Don’t recive the OTP? <Text style={{color:themeStyle.PRIMARY_COLOR}}>Resend</Text></Text>

 </View>

 <GlobalButton onPress={()=>navigation.navigate(ROUTES.SupplierCreateNewPassword)} marginTop={'10%'} title={'Submit'}/>
        </ScrollView>

 
        </View>

    )
}
export default SupplierOtp


const styles = StyleSheet.create({
    input: {
        width: 50,
        height:50,
        margin: 12,
        // backgroundColor:Colors.BG_GRAY,
        // color: Colors.BLACK,
        borderRadius: 5,
        padding: 18,
        textAlign: 'center',
        borderColor:themeStyle.TEXT_GREY,
        borderWidth:1,
        color:themeStyle.BLACK
    },
    inputFocused: {
        width: 50,
        height:50,
        borderColor:themeStyle.PRIMARY_COLOR,
        borderWidth:1,
        // borderColor:  Colors.TEXT_PINK
    },
});