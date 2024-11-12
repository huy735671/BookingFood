import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeAdmin = () => {
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" translucent backgroundColor="#4c8d6e" />

      <Text>HomeAdmin</Text>
    </SafeAreaView>
  )
}

export default HomeAdmin

const styles = StyleSheet.create({
  container:{
    flex:1,

  },
})