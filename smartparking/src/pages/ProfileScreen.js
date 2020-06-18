import React,{useState} from 'react';
import {StyleSheet, Text , View,Image,TouchableOpacity,Dimensions,SafeAreaView} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');
export default class ProfileScreen extends React.Component{
    render(){
      return(
        <SafeAreaView style={{backgroundColor:"green",flex:1}}>
         {/* <Image source={require('../images/profile1.png')} style={{flex:.5}}>
          </Image> */}
        </SafeAreaView>
      )
    }
  }