


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function DetailedPost() {


    const {id} = useLocalSearchParams();


  return (
    <View>
      <Text>DetailedPost | {id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})