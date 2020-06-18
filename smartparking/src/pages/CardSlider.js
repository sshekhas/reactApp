// import React from 'react'
// import {Text, View, Dimensions} from 'react-native'
 
import SlidingUpPanel from 'rn-sliding-up-panel'
import Button from 'react-native-button';
 

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    
    Picker,
Icon,
ActivityIndicator,
 
} from 'react-native';
const { width, height } = Dimensions.get('window');
//   import { Dropdown } from 'react-native-material-dropdown';
 

// import SlidingPanel from 'react-native-sliding-up-down-panels';
import DatePicker from 'react-native-datepicker';
 
export default class CardSlider extends React.Component {
 
    constructor(props) {
 
        super(props);
 
        this.state = {
            isLoading: true,
            startDateTime: new Date(),
            endDateTime: new Date(),
            PickerValueHolder: '',
            dataSource:null,  
           
 
        }
 

    }
 

     async componentDidMount() {
 
        try{
            console.log("before fetch")
            const response=await fetch('https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/vehicle/search?Userid=pgupta298@dxc.com');
            console.log("after fetch")
            const responseJson= await response.json();
            this.setState({
                isLoading:false,
                dataSource:responseJson.Items
            });
        }
        catch(error)
        {
            console.log(error);
        }
    }
 
    render(){
        // Console.log(endDateTime);
        // Console.log(this.state.startDateTime);
        if(this.state.isLoading){
            return(
                <View style={styles.container}>
            <ActivityIndicator size="large" />
            </View>
            )
            
        }
        else
        {
            console.log(this.state.dataSource);
            return (
                <View style={styles.container}>
    
                    <View style={styles.bodyViewStyle}>
                        <Text>Hello My World</Text>
                    </View>
                    <SlidingUpPanel
                        ref={c => (this._panel = c)}
                        draggableRange={{ top: height / 1.3, bottom: 120 }}
                        animatedValue={this._draggedValue}
                        showBackdrop={false}>
                        <View style={styles.panel}>
                            <View style={styles.headerLayoutStyle}>
                                <Text style={styles.headerTextStyle}>Parking Reservation</Text>
                            </View>
                            <View style={styles.slidingPanelLayoutStyle}>
                                <Text style={styles.titleTextStyle}>{"\n"}Location:</Text>
                                <Text style={styles.commonTextStyle}>DXC-EC1</Text>
                                <Text style={styles.titleTextStyle}> {"\n"}Vehicle:</Text>
                                <View style={{ borderWidth: 1, borderRadius: 6, borderColor: 'black', width: width * 0.6 }}>
                                    <Picker
                                        selectedValue={this.state.PickerValueHolder}
                                        style={{ borderRadius: 6, width: width * 0.6 }}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
    
                                        {this.state.dataSource.map((item, key) => 
                                            (
                                            <Picker.Item label={item.VehicleDetails.VehicleNumber} value={item.VehicleDetails.VehicleNumber} key={item.VehicleDetails.VehicleNumber} />)
                                        )}
    
                                    </Picker>
                                </View>
                                <Text style={styles.titleTextStyle}> {"\n"}Start Time:</Text>
                                
                                
                                <DatePicker
                                    style={{ width: width * 0.5 }}
                                    date={this.state.startDateTime}
                                    mode="datetime"
                                    format=" HH:mm  DD-MM"
                                    confirmBtnText="Confirm"
                                    minDate={new Date()}
    
                                    cancelBtnText="Cancel"
                                    showIcon={true}
                                    customStyles={{
    
                                        dateInput: {
                                            borderColor: '#234456',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            //   marginLeft: 36,
                                            //   paddingLeft: 15,
                                        }
                                    }}
                                    onDateChange={(DateTime) => { this.setState({ startDateTime: DateTime }); }}
                                />
                                <Text style={styles.titleTextStyle}> {"\n"}End Time:</Text>
                                <DatePicker
                                    style={{ width: width * 0.5, }}
                                    // date={this.state.endDateTime}
                                    date={''}
                                    mode="datetime"
                                    format=" HH:mm  DD-MM"
                                    minDate={new Date()}
    
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={true}
                                    customStyles={{
    
                                        dateInput: {
                                            borderColor: '#234456',
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            //   marginLeft: 36,
                                            //   paddingLeft: 15,
                                        },
    
                                        // placeholderText: {
                                        //     fontSize: 50,
                                        //     color: '#00ffff'
                                        // }
                                    }}
                                    onDateChange={(DateTime) => { this.setState({ endDateTime: DateTime }); }}
                                />
                                <View style={{alignItems:'center'}}>
                                    <Button
                                      style={{fontSize: 20, color: 'black', alignItems:'center'}}
                                      containerStyle={{ marginTop:40, borderWidth:1, alignItems: 'center', padding: 10,width: 100, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'yellow' }}
                                      styleDisabled={{color: 'red'}}
                                      onPress={() => this._handlePress()}>
                                      Submit
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </SlidingUpPanel>
                </View>
    
            )
        }
        
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    bodyViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: '#00ffff'
    },
    headerLayoutStyle: {
        width: width - (24 * 2),
        // padding:15,
        marginHorizontal: 24,
        borderRadius: 6,
        height: 100,
        // marginTop:3,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidingPanelLayoutStyle: {
        width: width - (24 * 2),
        // padding:15,
        // height:height*0.6,
        marginHorizontal: 24,
        borderRadius: 6,
        height,
        backgroundColor: 'white',
        padding: 20,
 
    },
    commonTextStyle: {
        color: 'black',
        fontSize: 24,
    },
    titleTextStyle: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerTextStyle: {
        color: 'white',
        fontSize: 28,
    },
    panel: {
        width: width - (24 * 2),
        // padding:15,
        // height:height*0.6,
        marginHorizontal: 24,
        borderRadius: 6,
        height,
        backgroundColor: 'white',
        alignItems: 'center',
        // position: 'relative'
    },
});





 


