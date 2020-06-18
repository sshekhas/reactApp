import {StyleSheet,Dimensions} from 'react-native';
import * as theme from './theme';
 import {widthPercentageToDP,heightPercentageToDP,listenOrientationChange,removeOrientationListener} from './Responsive';
//  import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
//   listenOrientationChange as lor,
//   removeOrientationListener as rol
// } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      backgroundColor:'black',
      // height:height*.06,
      height:heightPercentageToDP('6%'),
      width:width,
      flexDirection:'row',
       //alignContent:"center",
      // alignSelf:"center"
      //flex:.06,
      // justifyContent:"center"
    },
    parkingHeader:{
    color:'white',
    fontSize:widthPercentageToDP('4.5%'),
    paddingLeft:7,
    alignSelf:"center",
    marginLeft:widthPercentageToDP("25%")
  },
  slotContinue: {
    height: 65,
    borderRadius: 8,
    //flexDirection: 'row',
    alignItems: 'center',
    alignSelf: "auto",
    width: width*.35,
    margin:width*.05,
    justifyContent: 'center',
    padding: theme.SIZES.base * 1.75,
    backgroundColor: 'rgb(255, 198, 10)',
    borderColor: 'rgb(255, 198, 10)',
    borderWidth: 2,
   
    marginTop: 20
},
slotBack: {
  borderRadius: 8,
  height: 65,
  //flexDirection: 'row',
  alignItems: 'center',
  width:width*.35,
  alignSelf: "auto",
  justifyContent: 'center',
  margin:width*.05,
  padding: theme.SIZES.base * 1.75,
  backgroundColor: theme.COLORS.white,
  borderColor: theme.COLORS.black,
  borderWidth: 2,

  marginTop: 20
},

payText: {
  fontWeight: 'bold',
  fontSize: theme.SIZES.base * 1.65,
  color: theme.COLORS.black,
  alignSelf: 'center',
  
  // margin: 20
},
    logo:{
      height:heightPercentageToDP('4%'),
      width:widthPercentageToDP('8%'),
      alignSelf:"center"
    },
    slotLocation:{
      fontSize:20,
      width:widthPercentageToDP('25%'),
      //backgroundColor:"pink"
    },
    statusBackground:{
      backgroundColor:'grey',
      width:widthPercentageToDP('22.5%'),
      marginLeft:widthPercentageToDP('20%'),
       // left:55,
      //  paddingLeft:widthToDp(10),
      justifyContent:"center",
    },
    status:{
      fontSize:14,
      color:'white',
      // paddingLeft:5,
      alignSelf:"center",
     
    },
    slotBackground:{
      backgroundColor:'black',
      width:widthPercentageToDP('21%'),
      justifyContent:"center"
      },
    slot:{
      color:'#FFC107',
      fontSize:14,
      alignSelf:"center"
    },
    bookingDetails:{
      flexDirection:'row',
      justifyContent:'space-between',
      //backgroundColor:"pink"

    },
    bookingContainer:{
      paddingTop:10,
      alignItems:'baseline',
     // backgroundColor:"yellow"
    },
    inDate:{
      fontSize:18,
      paddingLeft:widthPercentageToDP('2%')
    },
    inTime:{
      fontSize:18,
      paddingLeft:widthPercentageToDP('2.5%')
    },
    car:{
      height:heightPercentageToDP('2.5%'),
      width:widthPercentageToDP('20%'),
      // resizeMode:"contain",
      paddingTop:10,
      marginTop:heightPercentageToDP('1%'),
      //backgroundColor:"yellow"
    },
    outGateContainer:{
      paddingTop:10,
      alignItems:'baseline',
      //backgroundColor:"yellow",
      marginRight:widthPercentageToDP('5%')
    },
    outDate:{
      fontSize:18,
      // paddingLeft:8
      
    },
    outTime:{
      fontSize:18,
      // paddingLeft:4,
       //paddingRight:16
    },
    homeIcon:{
      // paddingRight:35,
      flexDirection:'row',
     // backgroundColor:"yellow",
      marginTop:heightPercentageToDP('1.5%'),
      //justifyContent:"space-around",
      width:widthPercentageToDP('50%'),
      marginLeft:widthPercentageToDP('2%')
    },
    mapmarker:{
      paddingLeft:widthPercentageToDP('1%')
    },
    ellipsisContainer:{
     // backgroundColor:"blue",
      width:widthPercentageToDP('40%'),
      marginTop:heightPercentageToDP('1.5%'),
      //justifyContent:"space-around"
      marginLeft:widthPercentageToDP('25%')
    },
    text:{
      //fontSize: widthPercentageToDP('50%'),
      flexDirection:'row',
       //backgroundColor:"blue",
     // justifyContent:'space-between',
      height:heightPercentageToDP('4%'),
      width:widthPercentageToDP('90%')
    },
    floatButton:{
      
      borderRadius: 10,
      bottom:-130,
      alignItems:"center",
      justifyContent:"center",
      shadowRadius:10,
      shadowOpacity:0.3,
      color:"rgb(255, 198, 10)"
    },
    backButton:{
        backgroundColor:'red'
    }, 
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 5,
      padding: 10,
      height: 150,
    },
    itemName: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
      fontSize:10,
      paddingLeft:10
    },
    gridView: {
      marginTop: 20,
      flex: 1,
      
    },
    legend:
    {
    flexDirection:'row',
    height:height*.06,
    alignSelf:"center",
    //backgroundColor:"white"
    //flexWrap:"wrap"
    //width:width*0.9
  },
  locationDisplay:{
    height:height*.05,
    paddingBottom:10,
    fontWeight:"bold",
    //backgroundColor:"red",
    width:width*.9,
    alignSelf:"center",

  },
    safecontainer:{
      height:height,
      //flex:1
      backgroundColor:"black",
       flex:1
      // marginBottom:100
    },
    slotsafecontainer:{
      height:height,
      //flex:1
      backgroundColor:"white",
       flex:1
      // marginBottom:100
    },
    mainContainer:{
      height:height,
     // backgroundColor:"yellow",
      flex:1

    },
    flatlist:{
      //height:height*.80,
      height:heightPercentageToDP('80%'),
      backgroundColor:"grey",
      flex:1,

      //marginBottom:height*.07,
      //paddingBottom:10

    },
    TouchableOpacityStyle:{
      
      position:"absolute",
      width:60,
      height:60,
      alignItems:"center",
      justifyContent:"center",
      //top:450,
      right:widthPercentageToDP('2%'),
      //marginBottom:height*.01,
      bottom:"1%",
       borderRadius:50,
      zIndex:1,
      backgroundColor:"black",
      
    },
    FloatingButtonStyle:{
      
      // width:40,
      // height:40,
      zIndex:1,
      color:"#FFC107",
      // paddingLeft:7,
      // paddingTop:5
      alignItems:"center",
      justifyContent:"center"
    },
    selected:{
      backgroundColor:"#FFC107",
      height:35,
      borderWidth:2,
      borderRadius:6,
      margin:10,
      alignItems:"center"

  },
  buttonText:{
      fontSize: 15, alignSelf: 'center',margin:5,paddingLeft:5,paddingRight:5
  },
  notselected:{
      backgroundColor:"gray",
      height:35,
      borderWidth:2,
      borderRadius:6,
      margin:10,
      alignItems:"center"
  }
  });
