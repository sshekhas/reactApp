import React,{useState} from 'react';
import {Dimensions,StyleSheet, Text , View,Image,TouchableOpacity,ActivityIndicator,ScrollView,Modal,TouchableHighlight,SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {styles} from './GlobalStyle'

import moment from 'moment'
// import { createAppContainer } from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './HomeScreen'
// import MapEx from './MapExample';
import {NavigationEvents} from 'react-navigation'
import { FlatList } from 'react-native-gesture-handler';
//import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import {widthPercentageToDP,heightPercentageToDP,listenOrientationChange,removeOrientationListener} from './Responsive';

const IconSize=height*.03;
const IconRoad=height*.06;


export default class SlotReservation extends React.Component{


  constructor(props){
    super(props);
    
    this.state={
      isLoading: true,
      dataSource: null,
      template:'',
      apiTemplate:null,
      psidIndex:null,
      prevIndex:null,
      currentIndex:null,
      modalVisible:false,
      loc:this.props.navigation.state.params.locid,
      rfid:this.props.navigation.state.params.rfid,
      reserveInTime:this.props.navigation.state.params.reserveInTime,
      reserveOutTime:this.props.navigation.state.params.reserveOutTime,
      bookingReference:this.props.navigation.state.params.Bookingref,
      userid:this.props.navigation.state.params.userid,
      VehicleNumber:this.props.navigation.state.params.VehicleNumber,


      eventDate:'',
      mins:0,
      secs:0,
      sessionCheck:true,
      count:0,
      sourceCount:0,
      stopIndex:null,
      DisplayInTime:'',
      DisplayOutTime:''
      // loc:"DXC-Park1",
      // rfid:"302",
      // reserveInTime:"2019-10-24T07:39:04",
      // reserveOutTime:"2019-10-24T12:55:04",
      // //bookingReference:null,
      // userid:"prateek@dxc.com"
     
    }  
    this.timer = null;
  
  }

     
   async componentDidMount()
    {
      try {
      //  console.log(this.state.loc)
      //  console.log(this.state.reserveInTime)
      //  console.log(this.state.reserveOutTime)
      //  console.log(this.state.rfid)
      //  console.log(this.state.VehicleNumber)
      console.log("slot mount testing")
      // const url="https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/parkingslot/reservation?locationid="+this.state.loc+"&fromtime="+this.state.reserveInTime+"&totime="+this.state.reserveOutTime+"&forRFID="+this.state.rfid
      const url="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-getstatus?LocationID="+this.state.loc+"&ReservedFrom="+this.state.reserveInTime+"&ReservedTo="+this.state.reserveOutTime+"&RFID="+this.state.rfid
      const url1="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getlayout?locationID="+this.state.loc

      //  console.log("url-> "+url)
      //  console.log("passed rfid"+this.state.rfid)
        const response = await fetch(url);
        const responseJson = await response.json();

        const responseTemplate = await fetch(url1);
        const templateResponse= await responseTemplate.json();

        let localInTime=moment.utc(this.state.reserveInTime).toDate();
        let outTime=moment.utc(this.state.reserveOutTime).toDate();
        console.log("wapas mount")
        this.setState({
          isLoading: false,
          dataSource: responseJson,
          prevIndex:null,
          modalVisible:false,
          apiTemplate:templateResponse.Items,
          abc:'abc',
          eventDate: moment.duration().add({minutes:0,seconds:59}),
          DisplayInTime:moment(localInTime).local().format("YYYY-MM-DDTHH:mm:ss"),
          DisplayOutTime:moment(outTime).local().format("YYYY-MM-DDTHH:mm:ss")
        });
      }
      catch (error) {
        console.log(error);
      }

      // console.log("mount source")
      // console.log(this.state.dataSource)
     
     }

    setIndex(){
      console.log("slot set index called");
      // let {dataSource}=this.state
       let{apiTemplate}=this.state
       var count=0;
       for(var i=0;i<apiTemplate[0].Layout.length;i++)
       {
           console.log("i -> "+i)
         if(apiTemplate[0].Layout[i].type=='Slot')
         {
             
           console.log("count -> "+count)
           apiTemplate[0].Layout[i].data=this.state.dataSource[count];
           apiTemplate[0].Layout[i].id=i;
           count++;
         }
         else
         {
           apiTemplate[0].Layout[i].id=i;
         }
       }
    //Object.assign(this.state, { isValid: true })
    // this.setState({template:localTemplate,});
    //Object.assign(this.state,{template:localTemplate})
    // console.log("template data check")
    //  console.log(JSON.stringify(this.state.template,null,2))
    
    }



     updateTimer=()=>{
    
      this.timer = setInterval(()=>{
        let { eventDate} = this.state
  
        if(eventDate <=0){
          clearInterval(this.timer);
          // if(this.state.sessionCheck)
          // {
            this.slotUnblocking();
          alert('Session Expired ');
          this.props.navigation.navigate("Home");
          // }
          
        }else {
          eventDate = eventDate.subtract(1,"s")
          // const days = eventDate.days()
          // const hours = eventDate.hours()
          const mins = eventDate.minutes()
          const secs = eventDate.seconds()
          
          this.setState({
          //   days,
          //   hours,
            mins,
            secs,
            eventDate
          })
        }
      },1000)
  
    }
  
 
  
    setIndexStatus()
    {
     
      let {apiTemplate}=this.state
      console.log("slot set Index Status")
      // console.log(JSON.stringify(template,null,2))
   //   console.log(template)
      
      
   for(var i=0;i<apiTemplate[0].Layout.length;i++)
   {
     if(apiTemplate[0].Layout[i].type=='Slot'){
       // console.log("i-> "+i);
       // console.log("rfid check"+this.state.rfid)
       // console.log("tempdata rfid"+template[i].data.RFID)
       // console.log("tempdata status"+template[i].data.ReservationStatus)
        console.log("i check "+i)
     if((apiTemplate[0].Layout[i].data.ReservationStatus=="Booked" || apiTemplate[0].Layout[i].data.ReservationStatus=="InProgress") && (apiTemplate[0].Layout[i].data.RFID==this.state.rfid))
     {
     
     //console.log("indexing null check")
     Object.assign(this.state,{
         prevIndex:i,
         psidIndex:i,
         currentIndex:i
       })
       // this.setState({
       //   prevIndex:i,
       //   psidIndex:i,
       //   currentIndex:i
       // });
     break;
     }
     }
     
   }
      Object.assign(this.state,{
        stopIndex:0
      })
      // this.setState({
      //   stopIndex:0
      // })
      console.log("prev index"+this.state.prevIndex)
      console.log("current index"+this.state.currentIndex)
      console.log("psid index"+this.state.psidIndex)
      //console.log(template[this.state.prevIndex].data.ReservationStatus)
      
    }

    
    getStatus(item,index)
    {
     
      console.log(JSON.stringify(item,null,2));
      if(item.data.ReservationStatus=="Available" || item.data.ReservationStatus=="Cancelled")
      {
       
        return "green";
      }

      

       if((item.data.ReservationStatus=="Booked" || item.data.ReservationStatus=="InProgress") && (item.data.RFID==this.state.rfid))
      {
        //console.log("blue "+item.RFID)
        // if(item.data.ReservationStatus=="InProgress")
        //   {
        //     return "grey"
        //   }
        //   else
        //   {
        //     return "blue";
        //   }
        return "blue";
          
      }
      if((item.data.ReservationStatus=="Booked" || item.data.ReservationStatus=="InProgress") && (item.data.RFID!=this.state.rfid))
      {
        //console.log("grey "+item.RFID)
        return "grey"
      }
      if(item.data.ReservationStatus=="Blocked")
      {
        return "grey"
      }
     

       if(item.data.ReservationStatus=="Selected")
      {
        //console.log("seklect"+item.RFID)
        return "blue"
      }
     
    }
    
    colorChange(item,index)
    {
      let {apiTemplate}=this.state;
      console.log("slot color change")
    //  console.log("psidIndex"+this.state.psidIndex)
    //  console.log("psidStatus"+template[this.state.psidIndex].data.ReservationStatus)
    //  console.log("clicked index "+index);
    //  console.log(template[index])
    //console.log("prev index color "+this.state.prevIndex)
    //console.log("Inprogress final check "+template[this.state.prevIndex].data.ReservationStatus)
      console.log("color change me index check "+this.state.prevIndex)
      console.log("index "+index)
      console.log(apiTemplate[0].Layout[index])
        
      
      if(this.state.prevIndex==null)
     {
       console.log("only blue color")
       let targetData=apiTemplate[0].Layout[index];
        targetData.data.ReservationStatus="Selected"
        apiTemplate[0].Layout[index]=targetData;
         this.setState({
           apiTemplate,
           //psidIndex:index,
           prevIndex:index,
           currentIndex:index
         });
     }
     
     else if( apiTemplate[0].Layout[this.state.prevIndex].data.ReservationStatus!="InProgress")
     {
       console.log("InProgress k andar")
          if(this.state.prevIndex!=null && apiTemplate[0].Layout[index].data.ReservationStatus=="Available" )
          
      {
        console.log("Available k andr")
     let prevData=apiTemplate[0].Layout[this.state.prevIndex]
         
      let targetData=apiTemplate[0].Layout[index];
       prevData.data.ReservationStatus="Available"; 
       targetData.data.ReservationStatus="Selected";
       apiTemplate[0].Layout[this.state.prevIndex]=prevData;
       apiTemplate[0].Layout[index]=targetData;
         this.setState({
           apiTemplate,
           prevIndex:index,
           currentIndex:index
         });
      }
      else
      {
        console.log("else Available k andr")
        if(apiTemplate[0].Layout[index].data.ReservationStatus=="Available")
        {
          let targetData=apiTemplate[0].Layout[index];
        targetData.data.ReservationStatus="Selected"
        apiTemplate[0].Layout[index]=targetData;
         this.setState({
           apiTemplate,
           prevIndex:index,
           currentIndex:index
         });
        }
        
      }
    }
      
    }

    slotUnblocking()
    {
        clearInterval(this.timer);
        // this.setState({
        //   eventDate: moment.duration().add({minutes:0,seconds:20})
        // })
    
        
        // let psidIndex=this.state.psidIndex
        let index=this.state.currentIndex
        //console.log("continue button pressed");
        if(this.state.psidIndex!=index)
        {

       // console.log("inside unblocking")
        let tempdataSource=this.state.apiTemplate[0].Layout
        // console.log(tempdataSource[index])
        //console.log("Loc id"+tempdataSource[index].LocationID,);
        // console.log("pid"+tempdataSource[psidIndex].ParkingSlotID);
        // console.log("rfrom"+this.state.reserveInTime);
        // console.log("rin"+this.state.reserveOutTime);
       // console.log("rfid"+this.state.rfid);
       // console.log("aid"+tempdataSource[index].ParkingSlotID);
        //console.log("bookingref"+this.state.bookingReference);
     //   console.log("Booking Reference "+this.state.bookingReference);
       // console.log(tempdataSource[index].data.ParkingSlotID)
        
        const url="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-unblocking?ParkingSlotID="+tempdataSource[index].data.ParkingSlotID+"&BookingReference="+this.state.bookingReference
        
        
        fetch(url,{
          method:'PUT',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            // LocationID:tempdataSource[index].LocationID,
            // ParkingSlotID:tempdataSource[psidIndex].ParkingSlotID,
            // ReservedFrom:this.state.reserveInTime,
            // ReservedTo:this.state.reserveOutTime,
            // RFID:this.state.rfid,
            // AllocatedSlotID:tempdataSource[index].ParkingSlotID,
            // BookingReference:this.state.bookingReference,
          }),
        })
        .then(res=>res.json())
        .then((res)=>
        {
          // this.setState({
          //   check:JSON.stringify(res)
          // });
          console.log("Successfully updated")
        },
        (error)=>{
          console.log(" Update failed")
        });
      }
        this.setState({
          modalVisible:false,
          prevIndex:null,
          isLoading:true,
          stopIndex:null
        },()=>{this.componentDidMount()});
        
        
        
  
      }
      slotBlocking()
    {
        console.log("slot Blocking prev index check "+this.state.prevIndex);
        let index=this.state.currentIndex

        if(this.state.currentIndex==null)
        {
          alert("Select a Slot!!")
          
        }
        else{

        

        if(this.state.psidIndex!=index)
        {
          

        
       // console.log("inside block")
        let tempdataSource=this.state.apiTemplate[0].Layout
        // let psidIndex=this.state.psidIndex
        
     //   console.log("index"+index)
        // console.log(tempdataSource[index])
        // console.log("Loc id"+tempdataSource[index].LocationID,);
        // // console.log("pid"+tempdataSource[psidIndex].ParkingSlotID);
        // console.log("rfrom"+this.state.reserveInTime);
        // console.log("rin"+this.state.reserveOutTime);
        // console.log("rfid"+this.state.rfid);
        // console.log("aid"+tempdataSource[index].ParkingSlotID);
        // console.log("bookingref"+this.state.bookingReference);
        // console.log("null check"+null)
        const url="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-blocking?RFID="+this.state.rfid+"&ReservedFrom="+this.state.reserveInTime+"&ReservedTo="+this.state.reserveOutTime+"&LocationID="+this.state.loc+"&ParkingSlotID="+tempdataSource[index].data.ParkingSlotID+"&BookingReference="+this.state.bookingReference
        
        
        fetch(url,{
          method:'PUT',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            // LocationID:tempdataSource[index].LocationID,
            // ParkingSlotID:tempdataSource[psidIndex].ParkingSlotID,
            // ReservedFrom:this.state.reserveInTime,
            // ReservedTo:this.state.reserveOutTime,
            // RFID:this.state.rfid,
            // AllocatedSlotID:tempdataSource[index].ParkingSlotID,
            // BookingReference:this.state.bookingReference,
          }),
        })
        .then(res=>res.json())
        .then((res)=>
        {
          if(res!=null){
          this.setState({
            bookingReference:res
          });}
          
        },
        (error)=>{
          console.log(" Update failed")
        });
        }
      
        this.setState({
          modalVisible:true
        });
      }
        
  
      }

  slotUpdate()
    {

      clearInterval(this.timer);
        
      //console.log("save button pressed");
      let tempdataSource=this.state.apiTemplate[0].Layout
      let psidIndex=this.state.psidIndex
      let index=this.state.currentIndex
      // console.log(tempdataSource[index])
      // console.log("Loc id"+tempdataSource[index].LocationID,);
      // console.log("pid"+tempdataSource[psidIndex].ParkingSlotID);
      // console.log("rfrom"+this.state.reserveInTime);
      // console.log("rin"+this.state.reserveOutTime);
      // console.log("rfid"+this.state.rfid);
      // console.log("aid"+tempdataSource[index].ParkingSlotID);
      let url="";
      //console.log("bookingref"+this.state.bookingReference);
      if(this.state.psidIndex!=null){
       // console.log("if block url")
      url="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-confirmation?ParkingSlotID="+tempdataSource[index].data.ParkingSlotID+"&BookingReference="+this.state.bookingReference+"&RFID="+this.state.rfid+"&ReservedFrom="+this.state.reserveInTime+"&ReservedTo="+this.state.reserveOutTime+"&LocationID="+tempdataSource[index].data.LocationID+"&UserID="+this.state.userid+"&PreviousSlotID="+tempdataSource[psidIndex].data.ParkingSlotID
      }
      else{
       // console.log("else block url")
      url="https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-confirmation?ParkingSlotID="+tempdataSource[index].data.ParkingSlotID+"&BookingReference="+this.state.bookingReference+"&RFID="+this.state.rfid+"&ReservedFrom="+this.state.reserveInTime+"&ReservedTo="+this.state.reserveOutTime+"&LocationID="+tempdataSource[index].data.LocationID+"&UserID="+this.state.userid

      }
      
      
      fetch(url,{
        method:'PUT',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          // LocationID:tempdataSource[index].LocationID,
          // ParkingSlotID:tempdataSource[psidIndex].ParkingSlotID,
          // ReservedFrom:this.state.reserveInTime,
          // ReservedTo:this.state.reserveOutTime,
          // RFID:this.state.rfid,
          // AllocatedSlotID:tempdataSource[index].ParkingSlotID,
          // BookingReference:this.state.bookingReference,
        }),
      })
      .then(res=>res.json())
      .then((res)=>
      {
        // this.setState({
        //   check:JSON.stringify(res)
        // });
        //console.log("Successfully updated")
      },
      (error)=>{
        console.log(" Update failed")
      });
    
      this.setState({
        sessionCheck:false,
        modalVisible:false
      });
      this.props.navigation.navigate("Home");
      

    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }



    displayRender(item,index){
      // console.log("display render k andr")
      // console.log(item)
   if(item.type=='Road')
   {
     //console.log("if")
     //transform:[{rotateZ:'90deg'}]
         if(item.align=="horizontal")
         {
             return(
     
                 <View style={{width:(width*.9)/4,height:height*0.06,alignItems:"center",backgroundColor:"white"}}>
                  <MaterialCommunityIcons
                  name="road"
                  //type="MaterialCommunityIcons"
                  size={IconRoad}
                  color="black"
                  //reverseColor="white"
                  style={{height:height*.07,paddingLeft:10,transform:[{rotateZ:'90deg'}]}}
                  />
                  </View>
                        
                 )
         }
         else
         {   
             return(
     
                 <View style={{width:(width*.9)/4,height:height*0.06,alignItems:"center",backgroundColor:"white"}}>
                  <MaterialCommunityIcons
                  name="road"
                  //type="MaterialCommunityIcons"
                  size={IconRoad}
                  color="black"
                  //reverseColor="white"
                  style={{height:height*.07,paddingLeft:10}}
                  />
                  </View>
                        
                 )
         }
      
 
   }
   else if(item.type=='Slot')
   {
      //console.log(" else if")
     return(
                     
     <View style={{borderWidth:1,borderStyle:'solid',borderRadius:10,width:(width*.9)/4,height:height*0.06,flexDirection:'row',alignItems:"center",paddingLeft:((width*.9)/4)*.1}} key={item.ParkingSlotID}>
   <Text style={{fontSize:height*.02}}>{item.data.Name}</Text>
                         
                         <Icon 
                             name="car" 
                              size={IconSize} 
                             //size={20}
                              color={(this.getStatus(item,index))}
                              //color="green"
                             style={{paddingLeft:((widthPercentageToDP('90%'))/4)*.15}}
                             onPress={()=> this.colorChange(item,index)}
                             />
                         </View>
                       
   )
   }
   else if(item.type=='Block' || item.type=='Building')
   {
     return(
       <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8,backgroundColor:"gray"}}>
                     
       </View>
     )
   }
   else if(item.type=='Wall')
   {
        let wallsize=heightPercentageToDP('5%');
       return(
         <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8,alignItems:"center"}}>
                     
                 <MaterialCommunityIcons
                 name="wall"
                 //type="MaterialCommunityIcons"
                 size={wallsize}
                 color="black"
                 //reverseColor="white"
                 // iconStyle={{height:height,paddingLeft:10}}
                 />
         </View>
       )
   }
   else if(item.type=='Path')
   {
       let pathSize=heightPercentageToDP('5%');
       return(
 
        <View style={{width:(width*.9)/4,height:height*0.06,padding:8,alignItems:"center"}}>
                     
                 <Ionicons
                 name="ios-walk"
                 //type="MaterialCommunityIcons"
                 size={pathSize}
                 color="black"
                 //reverseColor="white"
                 // iconStyle={{height:height,paddingLeft:10}}
                 />
         </View>
       )
   }
   else if(item.type=='Entrance')
   {
       return(
         <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8,alignItems:"center"}}>
             <Text style={{fontSize:height*.03,fontWeight:"bold"}}>Entry</Text>
             </View>
 
       )
   }
   else if(item.type=='Exit')
   {
       return(
         <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8,alignItems:"center"}}>
             <Text style={{fontSize:height*.03,fontWeight:"bold"}}>Exit</Text>
             </View>
 
       )
   }
   else if(item.type=='Gate'){
       let gateSize=width*0.12;
       return(
         <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8,alignItems:"center"}}>
        
        <MaterialCommunityIcons
                 name="gate"
                 //type="MaterialCommunityIcons"
                 size={gateSize}
                 color="black"
                 //reverseColor="white"
                 // iconStyle={{height:height,paddingLeft:10}}
                 />
         </View>
       )
   }
   else{
     // console.log("else")
     return(
     
                       <View style={{width:(width*.9)/4,height:height*0.06,flexDirection:'row',padding:8}}>
                     
                        </View>
                     
   )
   }
 }

 


    render(){
     // console.log("width ->"+width)
    // console.log("render called")
      if(this.state.isLoading){
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        )
      }
      
      else{
        //console.log(this.state.dataSource)
     //   console.log("render else called")
        const { mins, secs } = this.state;
        if(this.state.stopIndex==null)
        {
          console.log("stopIndex k andr")
          this.setIndex()
          this.setIndexStatus()
        }
        
        return(
          
          <SafeAreaView style={styles.safecontainer}> 
          <View style={{backgroundColor:"white",height:height}}> 
             {/* <NavigationEvents
                onDidFocus={() => this.componentDidMount()}
            /> */}
            <View style={styles.header}>
              <Image source={require('../images/logo.png')} style={styles.logo}>
              </Image>
                <Text style={styles.parkingHeader}>
                  Parking Reservation
                </Text>
              </View>
              <View style={styles.legend}>
                <Icon name="circle" size={25} style={{color:'grey',paddingLeft:10,paddingTop:10,flexWrap:"wrap"}} />
                <Text style={{fontSize:20,paddingLeft:10,paddingTop:10,flexWrap:"wrap"}}>Booked</Text>
                <Icon name="circle" size={25} style={{color:'green',paddingLeft:10,paddingTop:10,flexWrap:"wrap"}} />
                <Text style={{fontSize:20,paddingLeft:10,paddingTop:10,flexWrap:"wrap"}}>Available</Text>
                <Icon name="circle" size={25} style={{color:'blue',paddingLeft:10,paddingTop:10,flexWrap:"wrap"}} />
                <Text style={{fontSize:20,paddingLeft:10,paddingTop:10,flexWrap:"wrap"}}>Selected</Text>
              </View>
              <View style={styles.locationDisplay}>
        <Text style={{fontSize:20,alignSelf:"center",fontWeight:"bold"}}>{this.state.loc}</Text>
              </View>

              <View style={{alignSelf:"center",alignItems:"center",height:height*.55,width:width*.9}}>
             {/* {console.log("Before FlatList")} */}

              <FlatList 
                  itemDimension={130}
                  data={this.state.apiTemplate[0].Layout}
                  horizontal={false}
                  numColumns={this.state.apiTemplate[0].noOfColumn}
                  
                  renderItem={({ item, index }) => (
                    
                    <View>{this.displayRender(item,index)}</View>
    
                  )}
                   keyExtractor={item => item.id}
                />
              </View>
               <View style={{alignSelf:"center",justifyContent:"center",height:height*.15,flexDirection:'row',width:width*.9,borderRadius:100}}> 
              {/* <View style={{flexDirection:'row',width:width*.9}}> */}
                    <TouchableOpacity style={styles.slotBack} onPress={()=>this.props.navigation.navigate("Maps",
                {
                  userid:this.state.dataSource[0].UserID,
                   newBooking:"true"
                })}>
                        <Text style={styles.payText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.slotContinue} onPress={() => {
                      this.slotBlocking();
                    }} >
                        <Text style={styles.payText}>Continue</Text>
                    </TouchableOpacity>

                    
                {/* </View> */}
                </View>
                {/* <View style={{height:heightPercentageToDP('50%'),backgroundColor:"yellow"}}> */}
                {
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onShow={() => {
                      this.updateTimer();
                    }}
                    >
                        <View style={{backgroundColor: "rgba(52, 52, 52, 0.8)",alignSelf: "center",alignContent:"center",flexDirection:"column-reverse", width: width, height:height}}>
                        {/* <View style={{height:heightPercentageToDP('45%')}}> */}
                        <View style={{  backgroundColor: "white", alignSelf: "center",  borderRadius: 9,marginBottom:20 }}>
                        <View style={{ alignItems: "center", flexDirection: 'row', width: width - 30 }}>

                            <Icon
                              name="close"
                              size={30}
                              color={"black"}
                               style={{paddingLeft:10,paddingTop:10}}
                              onPress={() => this.slotUnblocking()}
                              />

                                <Text style={{ paddingLeft: (width - 30) / 2 - 90, color: "black", fontWeight: "bold", fontSize: 20 }}> Summary</Text>

                                </View>
                                <View style={{fontSize: 20,justifyContent:'space-between',padding:10}}>
                                <Text style={{fontSize:20,paddingLeft:10}}>Review</Text>
                                <Text style={{fontSize:35,fontWeight:"bold"}}> ₹ 40</Text>
                                <Text style={{fontSize:20,paddingLeft:10,color:"orange",paddingTop:15}}>Review booking at:</Text>
                                <Text style={{fontSize:20,paddingLeft:10}}>{this.state.loc}</Text>
                                <Text style={{fontSize:20,paddingLeft:10}}>{moment(this.state.reserveInTime.split('T')[0].trim()).format('DD MMM')} {this.state.DisplayInTime.split('T')[1].trim()} to</Text>
                                <Text style={{fontSize:20,paddingLeft:10}}>{moment(this.state.reserveOutTime.split('T')[0].trim()).format('DD MMM')} {this.state.DisplayOutTime.split('T')[1].trim()}</Text>
                                <Text style={{fontSize:20,paddingLeft:10}}>Slot : {this.state.currentIndex==null?"null":this.state.apiTemplate[0].Layout[this.state.currentIndex].data.Name}</Text>
                                <Text style={{fontSize:20,paddingLeft:10,color:"orange",paddingTop:15}}>Vehicle Details:</Text>
                              <Text style={{fontSize:20,paddingLeft:10}}>{this.state.VehicleNumber}</Text>
                                <Text style={{fontWeight:"bold",fontSize:20,paddingLeft:10,marginTop:10}}>Session Expires in {`${mins} : ${secs}`}</Text>
                                </View>
                                <View style={{justifyContent:"center", flexDirection:'row',alignItems:"center"}}>
                        <TouchableHighlight
                          onPress={() => {
                            this.slotUnblocking();
                          }}
                          style={{backgroundColor:'white',height:65,width:'30%',borderRadius:10,borderColor:'black',borderWidth:1,alignSelf:"center",margin:heightPercentageToDP('1.5%')}}>
                          <Text style={{fontSize:20,alignSelf:'center',paddingTop:15}}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableOpacity style={{backgroundColor:'orange',height:65,width:'30%',borderRadius:10,borderColor:'black',alignSelf:"center",margin:heightPercentageToDP('1.5%')}} onPress={()=>this.slotUpdate()}>
                        <Text style={{fontSize:20,alignSelf:"center",paddingTop:15}}>Book</Text>
                      </TouchableOpacity>
                      </View>

                          </View>
                        
                          {/* </View>        */}
                          </View>              
                    </Modal>
      }
                {/* </View> */}
                </View>
          </SafeAreaView>
        )
      }
      
    }
  }

