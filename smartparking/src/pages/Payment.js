import React, { useState } from 'react';
import { Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView,RefreshControl } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';


export default class Payment extends React.Component{

    constructor(props){
      console.log("into payment constructor");
        super(props)
        this.state={
            navigate:false
        }
    }

    payment(){
        console.log("hello");
       var options = {
         description: 'Parking Charges',
         image: 'https://i.imgur.com/3g7nmJC.png',
         currency: 'INR',
         key: 'rzp_test_QvjURuc2f2aHxl',
         amount: '4000',
         name: 'Smart Parking',
        // order_id: 'Prateek_234',
         prefill: {
           email: 'pgupta298@dxc.com',
           contact: '9191919191',
           name: 'Prateek Gupta'
         },
         theme: {color: '#53a20e'}
       }
       RazorpayCheckout.open(options).then((data) => {
         // handle success
         console.log("success ");
         console.log(JSON.stringify(data,null,2));
        alert("Payemnt Successful.");
         this.setState({navigate:true})
        //  this.props.navigation.navigate("Home");
       }).catch((error) => {
         // handle failure
         console.log("failed error ");
         console.log(error)
          alert("Payment Failed:"+error.description);
          this.setState({navigate:true})
        //  this.props.navigation.navigate("Home");
       });
      }

    render(){
      console.log("into payment render ")
       return(
           <View>
               {this.state.navigate?this.props.navigation.navigate('Home'):this.payment()}
           </View>
       )
    }
}