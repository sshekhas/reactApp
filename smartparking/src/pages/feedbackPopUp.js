import React, { useState } from 'react';
import { Text, Dimensions, View, Image, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Modal } from 'react-native';
// import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './GlobalStyle'
import moment from 'moment'
import FeedbackIcon from './getFeedbackModal';
// import { NavigationEvents } from 'react-navigation'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
//import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
// import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
// var ratingJson = [{ color: "gray", review: "Terrible" }, { color: "gray", review: "Bad" }, { color: "gray", review: "Okay" }, { color: "gray", review: "Good" }, { color: "gray", review: "Great" }]
// const catArray = ["service", "maintenance", "technology", "others"];

export default class FeedbackModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasLoded: false,
            dataSource: null,
            modalVisible: true,
            count:0
           
        }
    }
    

    async componentDidMount() {
        try {
            const response = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/feedback?UserID=pgupta298@dxc.com');
            const responseJson = await response.json();
            console.log(JSON.stringify(responseJson, null, " "))
            this.setState({

                dataSource: responseJson
            });

            let { dataSource } = this.state
            // console.log("1111111111111111111" + JSON.stringify(dataSource, null, " "))
            // let inTime = "";
            let outTime = "";
            // let localInTime = ""
            // let localOutTime = ""
            for (var i = 0; i < dataSource.length; i++) {


                outTime = new Date(dataSource[i].OutTime);

                dataSource[i].sortOutTime = outTime.getTime();


            }
            // console.log("11111" + dataSource.length);
            // console.log(JSON.stringify(dataSource, null, " "))
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
                hasLoded: true,
                isLoading: false
            });

        }
        catch (error) {
            console.log(error);
        }

    }
    setTime()
    {
      if(this.state.count==0)
      {
        if (this.state.dataSource.length > 0)

      {
    //   console.log("2")
        let {dataSource}= this.state
        let inTime="";
        let outTime="";
        let localInTime=""
        let localOutTime=""

       
          inTime=dataSource[0].InTime;
          outTime=dataSource[0].OutTime;
          localInTime=moment.utc(inTime).toDate();
          localOutTime=moment.utc(outTime).toDate();
          dataSource[0].DisplayInTime=moment(localInTime).local().format("YYYY-MM-DDTHH:mm:ss");
          dataSource[0].DisplayOutTime=moment(localOutTime).local().format("YYYY-MM-DDTHH:mm:ss");
        
        // console.log("3")
        this.setState({
          dataSource,
          
        })
        this.state.count++;
        console.log("4")
    }
      }
    }
    toggle(index) {

        

        this.setState({
            modalVisible: false,
            

        })
    }

    render() {
        if (this.state.isLoading) {
            return (
               null
            )
        }
        else {
            this.setTime()
            ;
            const { dataSource } = this.state;
            return (
                <View>
                    {(this.state.hasLoded && dataSource.length) ?
                    

                        <FeedbackIcon
                        locationDetails = {this.state.dataSource[0].AllocatedSlotLocation}
                        slotName = {this.state.dataSource[0].Name}
                        InTime = {this.state.dataSource[0].DisplayInTime}
                        OutTime = {this.state.dataSource[0].DisplayOutTime}
                        VehicleNumber = {this.state.dataSource[0].VehicleDetails.VehicleNumber}
                        bookreff = {this.state.dataSource[0].BookingReference}
                        rfid ={this.state.dataSource[0].RFID}
                        insideModal = {true}
                        index="1"
                        updateparentstate = {this.toggle.bind(this)}
                        />
                        

                        : null}
                </View>
            )
        }
    }
}