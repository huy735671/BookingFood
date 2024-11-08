import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainNavigator from './src/naviagation/MainNavigator'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
    <MainNavigator />

    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({container: {
  flex: 1,
},
});