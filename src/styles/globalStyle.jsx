import { StyleSheet } from 'react-native'
import themeStyle, { FONT } from './themeStyle'

const globalStyle = StyleSheet.create({
    defaultTxt: { fontSize: 10, color: themeStyle.BLACK },
    smallTxt: { fontSize: 8, color: themeStyle.BLACK },

    headingTxt: { fontSize: 18, fontWeight: '800', color: themeStyle.PRIMARY_COLOR, fontFamily: FONT.poppins_bold, textAlign: 'center' },

    titleHeading: { fontSize: 18, fontWeight: '500', color: themeStyle.BLACK, fontFamily: FONT.poppins_medium },
    titleTxt: { fontSize: 16, fontWeight: '500', color: themeStyle.BLACK, fontFamily: FONT.poppins_medium },

    shadowDefault: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 3,
    },
})

export default globalStyle;