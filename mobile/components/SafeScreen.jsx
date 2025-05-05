import { View, Text, StyleSheet } from 'react-native'
import React, { use } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../constants/Colors'
export default function SafeScreen(children) {
    const insets = useSafeAreaInsets();
  return (
    <View styles={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
        {children}    
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
       
    },
})