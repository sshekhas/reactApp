import React from 'react';
import { Text , View,Image,ActivityIndicator,ScrollView,TouchableOpacity,Animated,TouchableWithoutFeedback,Dimensions,TouchableNativeFeedback,SafeAreaView,RefreshControl} from 'react-native';
import HomeScreen from './src/pages/HomeScreen'
// import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import {fcmService} from './src/pages/FCMService'
import Payment from './src/pages/Payment'
import HistoryScreen from './src/pages/HistoryScreen'
import SlotReservation from './src/pages/SlotReservation'
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,NavigationEvents} from 'react-navigation'
import ProfileScreen from './src/pages/ProfileScreen'
import MapIntegration from './src/pages/MapIntegration'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
const { width, height } = Dimensions.get('screen');
 import {widthToDp,heightToDp,listenToOrientationChanges,removeOrientationChanges} from './src/pages/Responsive'

Icon.loadFont();
  
export default class App extends React.Component{

constructor(props){
  super(props);

  this.state={

    flag:false
  }

}

componentDidMount(){
  listenToOrientationChanges(this)
}

componentWillUnmount(){
  removeOrientationChanges();
}

// onRegister(token){
//   console.log("[Notification FCM ] on Register: ",token)  
// }

// onNotification(notify){
//   alert("Notification Received")
//   console.log("[Notification FCM ] on Notification: ",notify)

//   console.log(notify._body)

//   // if(notify._body=="Prateek")
//   // {
//   //   alert("keep going")
//   // }

//   const channelObj={
//     channelID:"sampleChannelID",
//     channelName:"sampleChannelName",
//     channelDes:"sampleChannelDes"
//   }
//   const channel=fcmService.buildChannel(channelObj)

//   const buildNotify = {
//     dataId:notify._notificationId,
//     title: notify._title,
//     content: notify._body,
//     sound:"default",
//     channel:channel,
//     data:{},
//     colorBgIcon:"#1A243B",
//     vibrate:true
//   }

//   const notification=fcmService.buildNotification(buildNotify)
  
//   fcmService.displayNotification(notification)
// }

// onOpenNotification = (notify) => {

//   alert("notification aa gya")
//   console.log("[Notification FCM ] onOpenNotification: ",notify)
  
//   // console.log(notify.notification._data)
  

//   if(notify.notification._data.body=='Your slot')
//     {

//       this.setState({flag:true});
//       alert("background testing")
      
//     }
  
// }
  render(){
    // console.log("App js ka render")
    console.disableYellowBox = true;
    // if(this.state.flag)
    // {

    //   console.log("inside if "+this.state.flag)
    //   console.log("payment page")
      
    //   // return(<Payment />)
    //  return(this.props.navigation.navigate("Payment"))

    // }

    // else{
    //   console.log("home page opened")
    //   console.log("inside else "+this.state.flag)
      
    //   return(
    //     // <View style={{backgroundColor:"blue",flex:1}} >
    //     //   {/* <Text style={{justifyContent:"center"}}>Hello</Text> */}
    //     //   {console.log("app js ka render ka return")}
    //     //   {this.props.navigation.navigate("Home")}
    //     // </View>
       return(<HomeScreen />)
     
    //   this.props.navigation.navigate("Home")
    //   )
    // }
  }
}
// const navOptionHandler=(navigation)=>({
//   headerShown:false
// })

// const pageNav=createStackNavigator(
// {
//   App:{
//     screen:App,
//     navigationOptions:navOptionHandler

//   },
//   Home:{
//     screen:HomeScreen,
//     navigationOptions:navOptionHandler
//   },
 
  
 
//   History:{
//     screen:HistoryScreen,
//     navigationOptions:navOptionHandler
//   },
//   Slot:{
//     screen:SlotReservation,
//     navigationOptions:navOptionHandler
//   },
//   Maps:{
//     screen:MapIntegration,
//     navigationOptions: ({navigation}) => ({
//       headerShown:false,
//       tabBarVisible:false
//     })

//   },
//   // FeedBackPage:{
//   //   screen:getFeedbackModal,
//   //   navigationOptions:navOptionHandler
//   // },
//   Payment:{
//     screen:Payment,
//     navigationOptions:navOptionHandler
//   }
// }
// )

// const TabNavigator= createMaterialBottomTabNavigator(
// {
//   Home:{
//     screen:pageNav,
//     navigationOptions:({navigation})=>{
//       if(navigation.state.index>1)
//       {
//         return{
//           tabBarVisible:false
//         };
//       }
//       else
//       {
//         return{
//           tabBarIcon:({tintColor})=>(
//             <View>
//               <Icon style={[{color:tintColor}]} size={25} name={'home'} />
//             </View>
//           ),
//         };
//       }
      
//     }
//   },
//   History:{
//     screen:HistoryScreen,
//     navigationOptions:{
//       tabBarIcon:({tintColor})=>(
//         <View>
//           <Icon style={[{color:tintColor}]} size={25} name={'history'} />
//         </View>
//       ),
//     }
//   },
//   Profile:{
//     screen:ProfileScreen,
//     navigationOptions:()=>{
//       {
//         let abc=false;
//       if(abc){
//         return{
//           tabBarVisible:false
//         };
//       }
//       else{
//         return{
//           tabBarIcon:({tintColor})=>(
//             <View>
//               <Icon style={[{color:tintColor}]} size={25} name={'bars'} />
//             </View>
//           )
//         };
//       }
      

     


//     }
//   }
// }
// },

// {
//   initialRouteName: 'Home',
//   activeColor: '#FFC107',
//   inactiveColor:'white',
//   barStyle:{backgroundColor:'black',height:height*.07},
  
// }
// );


// export default createAppContainer(TabNavigator);


