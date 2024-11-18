import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { FONT } from '../styles/themeStyle'

export default function Empty({ title, otherViews }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", marginTop: '50%' }}>
      {otherViews}
      {!otherViews &&
        <>
          <Video
            source={require('../../assets/animations/cat.mp4')}
            resizeMode="cover"
            style={styles.video}
            repeat={true}
            paused={false}
          />
          <Text style={{ fontSize: 16, color: "black", marginTop: "0%", fontFamily: FONT.ManropeMedium, bottom: 25 }}>{title}</Text>
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  video: {
    height: 200,
    width: 200,
  },
});
