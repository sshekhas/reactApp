import React from 'react';
import { Text , View,Image,ActivityIndicator,ScrollView,TouchableOpacity,Animated,TouchableWithoutFeedback,Dimensions,TouchableNativeFeedback,SafeAreaView,RefreshControl, Platform,PixelRatio,Linking} from 'react-native';
import { Card,Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {createAppContainer,NavigationEvents} from 'react-navigation'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import HistoryScreen from './HistoryScreen'
import ProfileScreen from './ProfileScreen'
import {styles} from './GlobalStyle'
import moment from 'moment'
import SlotReservation from './SlotReservation';
import {createStackNavigator} from 'react-navigation-stack';
import { FlatList } from 'react-native-gesture-handler';
import getFeedbackModal from './getFeedbackModal'
import MapIntegration from './MapIntegration'
import FeedbackModal from './feedbackPopUp';
import Payment from './Payment';
import {fcmService} from './FCMService'
import {widthPercentageToDP,heightPercentageToDP,listenOrientationChange,removeOrientationListener} from './Responsive';



const { width, height } = Dimensions.get('window');

//testing

export  class HomeScreen extends React.Component{

    constructor(props){
      super(props);
      this.state={
        isLoading: true,
        dataSource: null,
        isHidden: false,
        screenHeight: 0,
        prevIndex: null,
        count:0,
        isFetching: false,
        showFeedback: true
      }
      this.toggle=this.toggle.bind(this)
    }

     componentDidMount()
    {
      listenOrientationChange(this);
      fcmService.register(this.onRegister, this.onNotification,this.onOpenNotification)
      this.getData()
      
    }
    componentWillUnmount() {
      removeOrientationListener();
    }
    onRegister(token){
      console.log("[Notification FCM ] on Register: ",token)  
    }

    onNotification = (notify) => {
      // alert("Notification Received")
      console.log("[Notification FCM ] on Notification: ",notify)
    
      // console.log(notify._body)
    
     
    
      const channelObj={
        channelID:"sampleChannelID",
        channelName:"sampleChannelName",
        channelDes:"sampleChannelDes"
      }
      const channel=fcmService.buildChannel(channelObj)
    
      let buildNotify={}
      if(Platform.OS=='ios')
      {
         buildNotify = {
          dataId:notify._messageId,
          title: notify._title,
          content: notify._body,
          sound:"default",
          channel:channel,
          data:{},
          colorBgIcon:"#1A243B",
          vibrate:true
        }
      }
      else
      {
          buildNotify = {
          dataId:notify._notificationId,
          title: notify._title,
          content: notify._body,
          sound:"default",
          channel:channel,
          data:{},
          colorBgIcon:"#1A243B",
          vibrate:true
      }
     
      }
    
      const notification=fcmService.buildNotification(buildNotify)
      
      fcmService.displayNotification(notification)
    

       
    }

    onOpenNotification = (notify) => {

     
      // alert("opened")
      
      console.log("[Notification FCM ] onOpenNotification: ",notify)
      // console.log(notify.notification._body)
      
   

      //for android
      if(Platform.OS=="android" && (notify.notification._body=="your parking charge is : 40" || notify.notification._data.body=="your parking charge is : 40"))
      {
        console.log("payment testing")
        this.props.navigation.navigate('Payment')
      }

      // fcmService.removeDeliveredNotification(notify);

      
    }

   async getData(){
      console.log("mount called");
      try {
        const response = await fetch('https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/parkinghistory/search?reservationstatuses=InProgress,Booked&userid=pgupta298@dxc.com');
        const responseJson = await response.json();
        //console.log("1")
        this.setState({
          
          dataSource: responseJson.Items,
        
          
        });

  let { dataSource } = this.state
            // console.log("1111111111111111111" + JSON.stringify(dataSource, null, " "))
            // let inTime = "";
            let outTime = "";
            // let localInTime = ""
            // let localOutTime = ""
            for (var i = 0; i < dataSource.length; i++) {


                outTime = new Date(dataSource[i].ReservedInTime);

                dataSource[i].sortOutTime = outTime.getTime();


            }
            console.log("11111" + dataSource.length);
            console.log(JSON.stringify(dataSource, null, " "))
            if (dataSource.length > 1) {
                dataSource.sort(function (a, b) {
                    // console.log("4444444444444" + a.OutTime);
                    var a1 = a.sortOutTime;
                    var b1 = b.sortOutTime;
                    // console.log("333333333333333333" + a1);
                    if (a1 < b1) {
                        return 1;
                    }
                    if (a1 > b1) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                })
            }
            
            this.setState({
                dataSource: dataSource,
                count:0,
                prevIndex:null,
                isFetching: false,
                isLoading: false,
            });
      //   Object.assign(this.state,{
      //     isLoading: false,
      //     dataSource: responseJson.Items,
      //     count:0,
      //     prevIndex:null
          
      //   });
        console.log("mount set state")
       //console.log(this.state.dataSource[0])
       
      
      }
      catch (error) {
        console.log(error);
      }

    //  console.log("datasoruce")
 // console.log(this.state.dataSource)
    }

    handleRefresh() {
      console.log("refresh called")
      this.setState({ isFetching: true,
      isLoading:true }, 
        ()=> { this.getData() });
   }

    setToggle()
    {
      console.log("set toggle called")
      //let count=0;
      if(this.state.count==0)
      {
        console.log("inside if set toggle called")
      //  console.log("toggle func called");
      let {dataSource}=this.state
      let inTime="";
      let outTime="";
      let localInTime=""
      let localOutTime=""
      for(var i=0;i<dataSource.length;i++)
      {
        dataSource[i].isShow= false;
        dataSource[i].isHeight = heightPercentageToDP('12%')
        inTime=dataSource[i].ReservedInTime;
        outTime=dataSource[i].ReservedOutTime;
        localInTime=moment.utc(inTime).toDate();
        localOutTime=moment.utc(outTime).toDate();
        dataSource[i].DisplayInTime=moment(localInTime).local().format("YYYY-MM-DDTHH:mm");
        dataSource[i].DisplayOutTime=moment(localOutTime).local().format("YYYY-MM-DDTHH:mm");
      }
      this.setState({dataSource,
      count:1});
      // Object.assign(this.state,{dataSource,
      //    count:1})
      console.log("set toggle ka set state")
        console.log("count inside if"+this.state.count)
    
      }
     
      
    }

    toggle(index)
    {
      console.log("toggle called");
      //console.log("index ->"+index)
      console.log("toggle prev index -> "+this.state.prevIndex)
      console.log("index -> "+index)
      let {dataSource}=this.state
      if(this.state.prevIndex==index)
      {
        console.log("equal index")
        let targetData=dataSource[index];
        //console.log()
        targetData.isShow= !targetData.isShow
        if(targetData.isHeight==heightPercentageToDP('18%'))
          targetData.isHeight= heightPercentageToDP('12%')
        else
          targetData.isHeight=heightPercentageToDP('18%')
        dataSource[index]=targetData;
        this.setState({
          dataSource,
          prevIndex:index
        });
      
      }
     else
     {

      
      if(this.state.prevIndex!=null)
      {
        console.log("different index");
        let prevData=dataSource[this.state.prevIndex]
        let targetData=dataSource[index];
        prevData.isShow= false
        prevData.isHeight=heightPercentageToDP('12%')
        targetData.isShow=true 
        targetData.isHeight=heightPercentageToDP('18%')
        dataSource[index]=targetData;
        dataSource[this.state.prevIndex]=prevData;
        this.setState({
          dataSource,
          prevIndex:index
        });
     
      }
      else
      {
        console.log("null index");
        let targetData=dataSource[index];
        targetData.isShow= true
        targetData.isHeight= heightPercentageToDP('18%')
        dataSource[index]=targetData;
        this.setState({
          dataSource,
          prevIndex:index
        });
        
      }
    }

    //console.log(JSON.stringify(this.state.dataSource[0],null,2));
    }

    NavigateToDestination(lat,long){
      console.log("Navigating to Destination")
      console.log(lat+" "+long)

      const startPoint=''
      //`${param.latitude},${param.longitude}`
      // const endPoint = {
      //   longitude: long,
      //   latitude: lat
      // }
      const to='?'+ `daddr=${`${lat},${long}`}`
      const transportPlan = `&dirflg=${'d'}`;
      
      
       //OpenMapDirections(null,endPoint, transportPlan).then(res => {
      //   console.log(res)
      // });
        const device=Platform.OS=='ios'?`https://maps.apple.com/`:`https://maps.google.com/`
      const url=`${device}${startPoint}${to}${transportPlan}`
      console.log("url -> "+url)
      Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          console.log("opening app")
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    }

    ReloadPage(){
      this.setState({
        isLoading:true,
        showFeedback: false
      })
      this.componentDidMount()
    }

  
    
    render(){
      console.disableYellowBox = true;
      let responsiveStyles=styles;
      //console.log("height"+height)
      console.log("render called")
      if(this.state.isLoading){
        return (
          <View style={responsiveStyles.container}>
            <ActivityIndicator size="large" />
          </View>
        )
      } else{
        
          if(this.state.count==0)
          {
            this.setToggle();
            //this.dateModify();
          }
          
        //  console.log(JSON.stringify(this.state.dataSource,null,2));
        return(
          
         
          <SafeAreaView style={responsiveStyles.safecontainer}>  
           <View style={responsiveStyles.mainContainer}>
            <NavigationEvents
                
                onDidFocus={() => this.ReloadPage()}

                />
           
            <View style={responsiveStyles.header}>
            <Image source={require('../images/logo.png')} style={responsiveStyles.logo}>
            </Image>
              <Text style={{color:'white',fontSize: widthPercentageToDP('4.5%'),paddingLeft:7,alignSelf:"center",marginLeft:widthPercentageToDP("25%")}}>
                Smart Parking
              </Text>
            </View>
            {
            this.state.showFeedback?<FeedbackModal/>:null}
              <View style={responsiveStyles.flatlist}>
              {console.log("flat list called")}
               <FlatList
              data={this.state.dataSource}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isFetching}
                  onRefresh={()=>this.handleRefresh()}
                />
              }
              renderItem={({item,index})=>(
                <TouchableWithoutFeedback key={item.BookingReference} onPress={()=>this.toggle(index)}>
                
                    <Card key={item.BookingReference} containerStyle={{alignSelf:"center",height:this.state.dataSource[index].isHeight,margin:heightPercentageToDP('1%'),borderRadius:6,width:widthPercentageToDP('95%')}} >
            <View style={responsiveStyles.text}>
                  <Text style={responsiveStyles.slotLocation}>{item.AllocatedSlotLocation}</Text>
                  <View style={responsiveStyles.statusBackground}>
                  <Text style={responsiveStyles.status}>{item.ReservationStatus}</Text>
                  </View>
                  <View style={responsiveStyles.slotBackground}>
                  <Text style={responsiveStyles.slot}>{item.Name}</Text>
                  </View>
               
            </View>
            
            <View style={responsiveStyles.bookingDetails}>
                <View style={responsiveStyles.bookingContainer}>
                  
                <Text style={responsiveStyles.inDate}>{moment(item.DisplayInTime.split('T')[0].trim()).format('DD MMM')}</Text>
                 
                  <Text style={responsiveStyles.inTime}>{item.DisplayInTime.split('T')[1].trim()}</Text>
                </View>
                <View>
                <Image source={require('../images/car.png')} style={responsiveStyles.car}>
                </Image>
                {/* <Icon name="car" size={40} /> */}
                 </View>
                <View style={responsiveStyles.outGateContainer}>
                  <Text style={responsiveStyles.outDate}>{moment(item.DisplayOutTime.split('T')[0].trim()).format('DD MMM')}</Text>
                  <Text style={responsiveStyles.outTime}>{item.DisplayOutTime.split('T')[1].trim()}</Text>
                </View>
            </View> 
       
        {
         this.state.dataSource[index].isShow?<View>
          <View style={{flexDirection:'row',width:widthPercentageToDP('90%')}}>  
           <View style={responsiveStyles.homeIcon}>
             <Icon name='map-marker' size={40} color='#FFC107' 

            // iconStyle={responsiveStyles.mapmarker}

            onPress ={ ()=>this.NavigateToDestination(parseFloat(item.AllocatedSlotLocationDetails.Latitude),parseFloat(item.AllocatedSlotLocationDetails.Longitude))}
/>
</View>
<View style={responsiveStyles.ellipsisContainer}> 
             <Icon name="ellipsis-h" size={40} color='#FFC107' 
             //iconStyle={responsiveStyles.ellipsis}
             onPress={()=>this.props.navigation.navigate('Maps',
             {
              //  slot page requires
              //  locid:item.AllocatedSlotLocation,
              //  rfid:item.RFID,
              //  reserveInTime:item.ReservedInTime,
              //  reserveOutTime:item.ReservedOutTime,
              //  Bookingref:item.BookingReference,
              //  userid:item.UserID,
              //  VehicleNumber:"abc"
              userid:item.UserID,
              item:item,
              newBooking:false
               })} />
               </View>
          
         
         </View>
         </View>:null
       }
        
              
            
           </Card>
          </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.BookingReference}
              />
              
              </View>  
            
              
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>this.props.navigation.navigate("Maps",
                {
                  userid:this.state.dataSource[0].UserID,
                   newBooking:true
                })}
                style={styles.TouchableOpacityStyle}>
                  <AntDesign 
                  name="plus"
                  size={40}
                  style={styles.FloatingButtonStyle}
                  />
                </TouchableOpacity>
                {/* {console.log("isHeight : "+this.state.dataSource[0].isHeight)}*/}
                {console.log("state count : "+this.state.count)} 

                {/* <View style={{backgroundColor:"yellow",height:height*.05,flexDirection:"row",alignItems:"center",}}>
                  <View style={{flexDirection:"column",alignItems:"center"}}>
                  <Icon name="home" size={30} style={{marginHorizontal:width*.13,color:"#FFC107"}}  />
                  <Text style={{fontSize:10,flexDirection:"column",color:"#FFC107"}}>Home</Text>
                  </View>
                  
            
                  <View style={{flexDirection:"column",alignItems:"center"}}>
                  <Icon name="history" size={30} style={{marginHorizontal:width*.13,color:"white"}} onPress={()=>this.props.navigation.navigate("History")}/>
                  <Text style={{fontSize:10,flexDirection:"column",color:"white"}}>History</Text>
                  </View>

                  <View style={{flexDirection:"column",alignItems:"center"}}>
                  <Icon name="bars" size={30} style={{marginHorizontal:width*.13,color:"white"}} onPress={()=>handleProfile()}/>
                  <Text style={{fontSize:10,flexDirection:"column",color:"white"}}>Profile</Text>  
                  </View>

                </View> */}
                </View>
                
                </SafeAreaView>
                
                
            
            
      ) 
      }
      
    }
  }
const navOptionHandler=(navigation)=>({
    headerShown:false
})

const pageNav=createStackNavigator(
  {
    Home:{
      screen:HomeScreen,
      navigationOptions:navOptionHandler
    },
    Slot:{
      screen:SlotReservation,
      navigationOptions:navOptionHandler
    },
    Maps:{
      screen:MapIntegration,
      navigationOptions:navOptionHandler

    },
    FeedBackPage:{
      screen:getFeedbackModal,
      navigationOptions:navOptionHandler
    },
    Payment:{
      screen:Payment,
      navigationOptions:navOptionHandler
    }
  }
)

 const TabNavigator= createMaterialBottomTabNavigator(
  {
    Home:{
      screen:pageNav,
      navigationOptions:({navigation})=>{
              if(navigation.state.index>0)
              {
                return{
                  tabBarVisible:false
                };
              }
              else
              {
                return{
                  tabBarIcon:({tintColor})=>(
                    <View>
                      <Icon style={[{color:tintColor}]} size={25} name={'home'} />
                    </View>
                  ),
                };
              }
              
            }
    },
    History:{
      screen:HistoryScreen,
      navigationOptions:{
        tabBarIcon:({tintColor})=>(
          <View>
            <Icon style={[{color:tintColor}]} size={25} name={'history'} />
          </View>
        ),
      }
    },
    Profile:{
      screen:ProfileScreen,
      navigationOptions:{
        tabBarIcon:({tintColor})=>(
          <View>
            <Icon style={[{color:tintColor}]} size={25} name={'bars'} />
          </View>
        ),
      }
    }
  },
  {
    initialRouteName: 'Home',
    activeColor: '#FFC107',
    inactiveColor:'white',
    barStyle:{backgroundColor:'black',height:height*.07},
    
  }
);


export default createAppContainer(TabNavigator);


