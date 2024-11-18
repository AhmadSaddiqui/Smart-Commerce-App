import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native'
import React from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import AuthHeader from '../components/AuthHeader'
import GlobalButton from '../components/GlobalButton'
import OnBoardButton from '../components/OnBoardButton'
import { ROUTES } from '../routes/RoutesConstants'

export default function Onboarding({ navigation }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{ flex: 1, backgroundColor: themeStyle.MEDIUM_BLACK }}>

                <StatusBar backgroundColor={themeStyle.PRIMARY_LIGHT} />
                <View style={{ bottom: 30 }}>
                    <View style={{ backgroundColor: themeStyle.PRIMARY_LIGHT }}>
                        <AuthHeader
                            marginTop={100}
                            title={'Welcome to Meat Me Halfway!'}
                            description={`your online premium Halal meat supplier \n platform! \n  We offer you the highest quality of fresh \n  cerfitied Halal-by-hand meat. Order in just a \n  few clicks and enjoy the simplicity of a digital \n  supplying experience.`}
                        />
                        <Image resizeMode='stretch' style={styles.homeImage} source={require('../../assets/images/OnBoarding/home.png')} />
                        <View style={styles.bottomContainer}>
                            <Image resizeMode='contain' style={styles.truckImage} source={require('../../assets/images/OnBoarding/truck.png')} />
                            <GlobalButton onPress={() => navigation.navigate(ROUTES.UserSignin)} title={'Get Started as User'} marginTop={'2%'} />
                            <OnBoardButton onPress={() => navigation.navigate(ROUTES.SupplierSignin)} title={'Get Started as Supplier'} marginTop={'5%'} />
                        </View>
                    </View>
                </View>
            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create(({
    bottomContainer: {
        height: 357, backgroundColor: themeStyle.MEDIUM_BLACK,
    }, truckImage: {
        height: 164, width: '90%', alignSelf: "center", marginTop: "5%"
    }, homeImage: {
        height: 350, width: '200%', alignSelf: "center",
    }, separator: {
        // height:20
    }
}))