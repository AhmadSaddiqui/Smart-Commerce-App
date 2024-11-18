
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Shimmer from './Shimmer'
import themeStyle from '../styles/themeStyle'

export default function Loader() {
  return (
    <View style={{flex:1}}>
 <View style={{marginTop:'5%',marginLeft:"5%"}}>
 <Shimmer style={styles.item1}/>
 <Shimmer style={styles.item2}/>
 <Shimmer style={styles.item3}/>
 <Shimmer style={styles.item4}/>
 <Shimmer style={styles.item5}/>
 <View style={{flexDirection:'row',alignItems:'center',width:'92%',justifyContent:'space-between'}}>
 <Shimmer style={styles.item6}/>
 <Shimmer style={styles.item7}/>



 </View>
 <Shimmer style={styles.item5}/>

 </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item1:{
    height:18,
    width:'50%',
    borderRadius:20,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"2%"

  },
  item2:{
    height:12,
    width:'60%',
    borderRadius:20,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"5%"
  },
  item3:{
    height:12,
    width:'55%',
    borderRadius:20,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"2%"
  },
  item4:{
    height:60,
    width:'92%',
    borderRadius:6,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"15%"
  },
  item5:{
    height:170,
    width:'92%',
    borderRadius:6,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"5%"
  },
  item6:{
    height:270,
    width:'48%',
    borderRadius:6,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"5%"
  },
  item7:{
    height:270,
    width:'48%',
    borderRadius:6,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"5%"
  },
  item8:{
    height:270,
    width:'50%',
    borderRadius:6,
     backgroundColor:themeStyle.lightgrey,
     marginTop:"5%"
  },
})