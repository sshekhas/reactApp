import React, { useState } from 'react';
import { Text, View, Image, ActivityIndicator, ScrollView, TouchableOpacity,Dimensions, SafeAreaView,RefreshControl,TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './GlobalStyle'
import moment from 'moment'
import { NavigationEvents } from 'react-navigation'
import { FlatList } from 'react-native-gesture-handler';
import FeedbackIcon from './getFeedbackModal';
import {widthPercentageToDP,heightPercentageToDP,listenOrientationChange,removeOrientationListener} from './Responsive';

// import { ScrollView } from 'react-native-gesture-handler';
//rzp_test_yx15BZkWwGL2LM
const { width, height } = Dimensions.get('screen');
export default class HistoryScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      count: 0,
      isFetching: false,
    }
  }

   componentDidMount() {
    this.getData()
  }

  async getData(){
    try {
      console.log("1")
      const response = await fetch('https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/parkinghistory/search?reservationstatuses=Completed,Cancelled&userid=pgupta298@dxc.com');
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        dataSource: responseJson.Items,
        prevIndex:null,
        count: 0,
        isFetching:false
      });
     
    }
    catch (error) {
      console.log(error);
    }
  }
  handleRefresh() {
    console.log("refresh called")
    this.setState({ isFetching: true }, 
      ()=> { this.getData() });
 }

 

  setTime() {
    if (this.state.count == 0) {


      console.log("2")
      let { dataSource } = this.state
      let inTime = "";
      let outTime = "";
      let localInTime = ""
      let localOutTime = ""

      for (var i = 0; i < dataSource.length; i++) {
        inTime = dataSource[i].ReservedInTime;
        outTime = dataSource[i].ReservedOutTime;
        localInTime = moment.utc(inTime).toDate();
        localOutTime = moment.utc(outTime).toDate();
        dataSource[i].DisplayInTime = moment(localInTime).local().format("YYYY-MM-DDTHH:mm");
        dataSource[i].DisplayOutTime = moment(localOutTime).local().format("YYYY-MM-DDTHH:mm");
      }
      console.log("3")
      this.setState({
        dataSource,

      })
      this.state.count++;
      console.log("4")
    }
  }
  setToggle() {
    //console.log("set toggle called")
    if (this.state.count == 0) {
      //console.log("set toggle called")
      //  console.log("toggle func called");
      let { dataSource } = this.state
      // let inTime = "";
      // let outTime = "";
      // let localInTime = ""
      // let localOutTime = ""
      for (var i = 0; i < dataSource.length; i++) {
        dataSource[i].isShow = false;
        dataSource[i].isHeight = heightPercentageToDP('12%');
        // inTime = dataSource[i].ReservedInTime;
        // outTime = dataSource[i].ReservedOutTime;
        // localInTime = moment.utc(inTime).toDate();
        // localOutTime = moment.utc(outTime).toDate();
        // dataSource[i].DisplayInTime = moment(localInTime).local().format("YYYY-MM-DDTHH:mm:ss");
        // dataSource[i].DisplayOutTime = moment(localOutTime).local().format("YYYY-MM-DDTHH:mm:ss");
      }
      this.setState({ dataSource,count:1 });
      
    }

  }

  toggle(index) {
    //console.log("index ->"+index)
    let { dataSource } = this.state
    if (this.state.prevIndex == index) {
      //console.log("first if")
      let targetData = dataSource[index];
      //console.log()
      targetData.isShow = !targetData.isShow
      if(targetData.isHeight==heightPercentageToDP('17%'))
          targetData.isHeight= heightPercentageToDP('12%')
      else
        targetData.isHeight = heightPercentageToDP('17%')
      dataSource[index] = targetData;
      this.setState({
        dataSource,
        prevIndex: index
      });
    }
    else {


      if (this.state.prevIndex!=null) {
        // console.log("if block");
        let prevData = dataSource[this.state.prevIndex]
        let targetData = dataSource[index];
        prevData.isShow = false
        prevData.isHeight = heightPercentageToDP('12%')
        targetData.isShow = true
        targetData.isHeight = heightPercentageToDP('17%')
        dataSource[index] = targetData;
        dataSource[this.state.prevIndex] = prevData;
        this.setState({
          dataSource,
          prevIndex: index
        });

        // console.log("current index -> "+index)
        // console.log("prev index datasource "+this.state.dataSource[this.state.prevIndex].isShow);
        // console.log("current index datasource-> "+this.state.dataSource[index].isShow)
        // console.log("prev data"+prevData.isShow)
        // console.log("current data"+targetData.isShow)
      }
      else {
        // console.log("else block");
        let targetData = dataSource[index];
        targetData.isShow = true
        targetData.isHeight = heightPercentageToDP('17%')
        dataSource[index] = targetData;
        this.setState({
          dataSource,
          prevIndex: index
        });

        //  console.log("current index -> "+index)
      }
    }
  }

  render() {
    let responsiveStyles=styles;
    if (this.state.isLoading) {
      return (
        <View style={responsiveStyles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    } else {
      {
        this.setToggle();
        this.setTime();
      }
      //console.log("5")
      console.log(JSON.stringify(this.state.dataSource));
      return (
        <SafeAreaView style={responsiveStyles.safecontainer}>
          <View style={responsiveStyles.mainContainer}>
          {/* <NavigationEvents
            onDidFocus={() => this.componentDidMount()}

          /> */}
          <View style={responsiveStyles.header}>
            <Image source={require('../images/logo.png')} style={responsiveStyles.logo}>
            </Image>
            <Text style={responsiveStyles.parkingHeader}>
              Parking History
            </Text>
            {/* <Icon name='filter' size={25} color='grey' style={{ marginTop: 35, marginLeft: 55 }} onPress={()=>this.props.navigation.navigate('Payment')}></Icon> */}
          </View>
          <View style={responsiveStyles.flatlist}>
            <FlatList
              data={this.state.dataSource}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isFetching}
                  onRefresh={()=>this.handleRefresh()}
                />
              }
              renderItem={({ item, index }) => (
                <TouchableWithoutFeedback key={item.BookingReference} onPress={() => this.toggle(index)}>
                  <Card key={item.BookingReference} containerStyle={{ height: this.state.dataSource[index].isHeight, margin: 7.5,borderRadius:6 }} >
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
                      </View>
                      <View style={responsiveStyles.outGateContainer}>
                        <Text style={responsiveStyles.outDate}>{moment(item.DisplayOutTime.split('T')[0].trim()).format('DD MMM')}</Text>
                        <Text style={responsiveStyles.outTime}>{item.DisplayOutTime.split('T')[1].trim()}</Text>
                      </View>
                    </View>
                    {item.isShow ? 
                      <FeedbackIcon
                      index = {index}
                      locationDetails = {item.AllocatedSlotLocation}
                      slotName = {item.Name}
                      bookreff = {item.BookingReference}
                      rfid ={ item.RFID}
                      InTime = {item.DisplayInTime}
                      OutTime = {item.DisplayOutTime}
                      VehicleNumber = {item.VehicleDetails.VehicleNumber}
                      insideModal = {false}
                      updateparentstate = {this.toggle.bind(this)}
                      ></FeedbackIcon>
                  
                  
             
            : null}
          
                  </Card>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={item => item.BookingReference}
            />
                   
          </View>

              {/* <View style={{backgroundColor:"black",flex:1,flexDirection:"row",alignItems:"center"}}>
                  <View style={{flexDirection:"column",alignItems:"center"}}>
                  <Icon name="home" size={30} style={{marginHorizontal:width*.13,color:"white"}} onPress={()=>this.props.navigation.navigate("Home")}  />
                  <Text style={{fontSize:10,flexDirection:"column",color:"white"}}>Home</Text>
                  </View>
                  
            
                  <View style={{flexDirection:"column",alignItems:"center"}}>
                  <Icon name="history" size={30} style={{marginHorizontal:width*.13,color:"#FFC107"}} />
                  <Text style={{fontSize:10,flexDirection:"column",color:"#FFC107"}}>History</Text>
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
