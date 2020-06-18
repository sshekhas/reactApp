import * as React from 'react';
import {
    StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, FlatList, TouchableWithoutFeedback, Picker, ActivityIndicator, TouchableHighlight, DatePickerAndroid,
    TimePickerAndroid, PermissionsAndroid, TextInput, Button, Image, KeyboardAvoidingView,
} from 'react-native';
import Slider from '@react-native-community/slider'
import MapView, { OverlayComponent } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BottomDrawer from 'rn-bottom-drawer';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import DateTimePicker from '@react-native-community/datetimepicker'
// import axios from 'axios';
import * as theme from './theme';
import moment from 'moment';
import { widthPercentageToDP, heightPercentageToDP, listenOrientationChange, removeOrientationListener } from './Responsive';



const { Marker } = MapView;
const { height, width } = Dimensions.get('screen');

const SCREEN_HEIGHT = height

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.008
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
let PROVIDER_GOOGLE = ''
Platform.OS == 'ios' ? PROVIDER_GOOGLE = null : PROVIDER_GOOGLE = "google"

const SCREEN_WIDTH = width

const API_KEY = 'AIzaSyBQao2Eq-l4nJwqwPrQNNonYKCmYt0iAVw'

export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.mapRef = null;
        this.state = {
            hours: {},
            date: new Date(),
            minDate: new Date(),
            showIOSDateTime: false,
            year: '',
            month: '',
            day: '',
            endDateTime: '',
            selectedhours: 4,
            dataSource: null,
            dataSourcePL: null,
            active: null,
            activeModal: null,
            activeCard: false,
            isLoadingDatasourcePL: true,
            isLoadingDatasource: true,
            isMarkerLoading: true,
            lat: 0,
            lng: 0,
            initialPosition: {
                latitude: null, longitude: null, latitudeDelta: null, longitudeDelta: null, boundLatNE: null, boundLongNE: null, boundLatSW: null, boundLongSW: null
            },
            markerPosition: { latitude: 0, longitude: 0 },
            locationID: null,
            price: 0,
            rating: 5,
            availableSlots: 0,
            llbounds: 0,
            mapBoundaries: null,
            PickerValueHolder: '',
            bookingreff: '',
            userid: this.props.navigation.state.params.userid,
            markerPrev: null,
            markerCurr: null,
            inProgressFlag: '',
            showIOSpicker: false,
            VehicleNumber: '',
            boundLatNE: null,
            boundLongNE: null,
            boundLatSW: null,
            boundLongSW: null,
            GPS_Flag: false,
            queryText: null,
            searchDataSourceResults: null,
            searchDataTitles: "",
            searchDataLatLng: null,
            resultStatus: false,
            SEARCH: false,
            isSearchModalVisible: false,
            // searchResultPosition: { searchlatNE: null, searchlatSW: null, searchlongNE: null, searchlongSW: null }
        }
        this.afterdateselected = this.afterdateselected.bind(this);
        this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
        this._datetimepicker = this._datetimepicker.bind(this);
    };

    async componentDidMount() {

        console.log("entered Map")

        if (this.props.navigation.state.params.newBooking == true) {
            try {
                if (Platform.OS != 'ios') {
                    const PERMISSION_GRANTED = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        title: 'Needs your current GPS Location to continue.',
                        message: 'Please grant permissions to access your current Location.',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                    )

                    if (PERMISSION_GRANTED === PermissionsAndroid.RESULTS.GRANTED) {

                        console.log("Entered if android")

                        this.getCurrentGPSPosition_ANDROID_TEST()
                    }

                    else {
                        console.log('Permission denied');
                    }
                }

                else {
                    this.getCurrentGPSPosition_IOS_TEST()
                }
            }

            catch (err) {
                console.log("--------------------INSIDE GEOLOCATION ERROR CATCH------------------")
                console.warn(err);
            }

            finally {
                console.log("entered into try API \n\n\n\n ")
                this.API1_USER_VEHICLES()

            }

        }

        else {
            this.existingBookingData()
        }


    }

    successCallback = async (position) => {
        // async successCallback(position) {
        console.log("ENTERED SUCCESS CALLBACK")
        var lat = parseFloat(position.coords.latitude)
        var lng = parseFloat(position.coords.longitude)

        var LatNE = lat + LATITUDE_DELTA / 2
        var LongNE = lng + LONGITUDE_DELTA / 2
        var LatSW = lat - LATITUDE_DELTA / 2
        var LongSW = lng - LONGITUDE_DELTA / 2


        // console.log("lAT LONG Variable Initial values")
        // console.log(lat)
        // console.log(lng)
        // console.log("BOUNDS Initial values")
        // console.log(LatNE)
        // console.log(LongNE)
        // console.log(LatSW)
        // console.log(LongSW)


        var initialRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            boundLatNE: LatNE,
            boundLongNE: LongNE,
            boundLatSW: LatSW,
            boundLongSW: LongSW,
        }

        console.log("---------------------------------ENTERED API 2 CALL()---------------------------")
        try {
            console.log(initialRegion.boundLatNE)
            console.log(initialRegion.boundLatSW)
            console.log(initialRegion.boundLongNE)
            console.log(initialRegion.boundLongSW)


            // const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + this.state.initialPosition.boundLatNE + '&lat2=' + this.state.initialPosition.boundLatSW + '&long1=' + this.state.initialPosition.boundLongNE + '&long2=' + this.state.initialPosition.boundLongSW)
            const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + initialRegion.boundLatNE + '&lat2=' + initialRegion.boundLatSW + '&long1=' + initialRegion.boundLongNE + '&long2=' + initialRegion.boundLongSW)
            const responseMarkersJSON = await responseMarkers.json();
            console.log(responseMarkersJSON)
            let sampleData = await responseMarkersJSON.Items
            console.log(sampleData)

            let markerPrev = 0

            if (sampleData.length != 0) {

                for (let i = 0; i < sampleData.length; i++) {
                    sampleData[i].markerID = i;
                    sampleData[i].markerStatus = false
                    sampleData[i].latitude = (parseFloat(sampleData[i].LocationDetails.Latitude))
                    sampleData[i].longitude = (parseFloat(sampleData[i].LocationDetails.Longitude))
                    // console.log("\n\n\n\n\nINSIDE FOR LOOP : " + typeof (sampleData[i].latitude) + "   " + (sampleData[i].latitude))
                    // console.log("-------------------" + JSON.stringify(sampleData,null,2))
                }

                sampleData[0].markerStatus = true

                this.setState({
                    initialPosition: initialRegion,
                    markerPosition: initialRegion,
                    locationID: sampleData[0].ParkingLocationID,
                    dataSourcePL: sampleData,
                    markerPrev: markerPrev,
                    isLoadingDatasourcePL: false
                })
            }
            else {
                let noParkingLocation = "No Parking Locations Nearby"
                console.log("\n\n\n\n" + noParkingLocation)

                this.setState({
                    initialPosition: initialRegion,
                    markerPosition: initialRegion,
                    locationID: noParkingLocation,
                    dataSourcePL: sampleData,
                    markerPrev: markerPrev,
                    isLoadingDatasourcePL: false
                })
            }

            // this.setState({
            //     dataSourcePL: sampleData,
            //     markerPrev: markerPrev,
            //     isLoading: false
            // })


        }
        catch (err) {
            console.log(err)
        }

    }

    errorCallback = () => {
        this.setState({ error: error.message })
        console.log(error.code, error.message);

    }

    async getCurrentGPSPosition_ANDROID_TEST() {
        console.log("\n\n\n\nENTERING getCurrentGPSPosition_ANDROID_TEST\n\n\n\n")
        await Geolocation.getCurrentPosition(this.successCallback, this.errorCallback, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
        console.log("\n\n\n\nEXITING getCurrentGPSPosition_ANDROID_TEST\n\n\n\n")

    }

    async getCurrentGPSPosition_IOS_TEST() {
        console.log("\n\n\n\nENTERING getCurrentGPSPosition_IOS_TEST\n\n\n\n")
        await Geolocation.getCurrentPosition(this.successCallback, this.errorCallback, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
        console.log("\n\n\n\nEXITING getCurrentGPSPosition_IOS_TEST\n\n\n\n")

    }

    async getCurrentGPSPosition_IOS() {
        await Geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var lng = parseFloat(position.coords.longitude)
                // console.log("Current Latitude position ios: " + parseFloat(position.coords.latitude));
                // console.log("Current Longitude position ios: " + parseFloat(position.coords.longitude));

                var LatNE = lat + LATITUDE_DELTA / 2
                var LongNE = lng + LONGITUDE_DELTA / 2
                var LatSW = lat - LATITUDE_DELTA / 2
                var LongSW = lat - LONGITUDE_DELTA / 2

                var initialRegion = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                    boundLatNE: LatNE,
                    boundLongNE: LongNE,
                    boundLatSW: LatSW,
                    boundLongSW: LongSW
                }

                this.setState({ initialPosition: initialRegion })
                this.setState({ markerPosition: initialRegion })
                // this.setState({ GPS_Flag: true })

            },

            (error) => {
                this.setState({ error: error.message })
                console.log(error.code, error.message);
            },

            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },

            this.watchID = Geolocation.watchPosition((position) => {
                var lat = parseFloat(position.coords.latitude)
                var lng = parseFloat(position.coords.longitude)
                // console.log("Current position : " + parseFloat(position.coords.latitude));

                var lastRegion = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
                this.setState({ initialPosition: lastRegion })
                this.setState({ markerPosition: lastRegion })
            })
        );
    }

    async API1_USER_VEHICLES() {

        console.log("---------------------------------ENTERED API 1 CALL()---------------------------")
        const response = await fetch('https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/vehicle/search?Userid=pgupta298@dxc.com');
        const responseJson = await response.json();
        var d = moment(this.state.date).add(this.state.selectedhours, 'hours');

        const hours = {};

        let PickerValueHolder = responseJson.Items[0].RFID

        // this.setState({ hours });

        this.setState({

            isMarkerLoading: false,
            dataSource: responseJson.Items,
            // dataSourcePL: responsePLJson.Items,
            endDateTime: d.toISOString().substring(0, 19),
            PickerValueHolder: PickerValueHolder,
            hours,
            inProgressFlag: true,
            isLoadingDatasource: false
        });
    }

    // async API2_GPS_LOCATION_MARKERS() {
    //     console.log("---------------------------------ENTERED API 2 GPS Location Markers CALL()---------------------------")
    //     try {
    //         const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + this.state.initialPosition.boundLatNE + '&lat2=' + this.state.initialPosition.boundLatSW + '&long1=' + this.state.initialPosition.boundLongNE + '&long2=' + this.state.initialPosition.boundLongSW)
    //         const responseMarkersJSON = await responseMarkers.json();
    //         console.log(responseMarkersJSON)
    //         let sampleData = await responseMarkersJSON.Items
    //         console.log(sampleData)

    //         let markerPrev = 0

    //         if (sampleData.length != 0) {

    //             for (let i = 0; i < sampleData.length; i++) {
    //                 sampleData[i].markerID = i;
    //                 sampleData[i].markerStatus = false
    //                 sampleData[i].latitude = (parseFloat(sampleData[i].LocationDetails.Latitude))
    //                 sampleData[i].longitude = (parseFloat(sampleData[i].LocationDetails.Longitude))
    //                 // console.log("\n\n\n\n\nINSIDE FOR LOOP : " + typeof (sampleData[i].latitude) + "   " + (sampleData[i].latitude))
    //                 // console.log("-------------------" + JSON.stringify(sampleData,null,2))
    //             }

    //             sampleData[0].markerStatus = true

    //             this.setState({
    //                 locationID: sampleData[0].ParkingLocationID,
    //             })
    //         }
    //         else {
    //             let noParkingLocation = "No Parking Locations Nearby"
    //             this.setState({
    //                 locationID: noParkingLocation
    //             })
    //         }

    //         this.setState({
    //             dataSourcePL: sampleData,
    //             markerPrev: markerPrev,
    //             isLoading: false
    //         })


    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    existingBookingData() {
        let response = this.props.navigation.state.params.item;
        // console.log("22222222222222" + JSON.stringify(response, null, 2));
        // let dataSource = this.state.dataSource;
        // dataSource[0] = ""
        // let dataSource = ''
        let dataSource = [
            {
                "RFID": response.RFID,
                "VehicleDetails": response.VehicleDetails
            }
        ];
        //  dataSource.RFID = response.RFID;
        // dataSource.VehicleDetails = response.VehicleDetails;
        // let dataSourcePL = this.state.dataSourcePL;
        // dataSourcePL= "";
        let dataSourcePL = [
            {
                "ParkingLocationID": response.AllocatedSlotLocation,
                "markerID": 0,
                "latitude": parseFloat(response.AllocatedSlotLocationDetails.Latitude),
                "longitude": parseFloat(response.AllocatedSlotLocationDetails.Longitude)

            }
        ]


        let a = new moment(response.DisplayInTime)
        let b = new moment(response.DisplayOutTime)
        // console.log("00000000000000"+a);
        let duration = moment.duration(b.diff(a));
        let selectedhours = duration.asHours();

        selectedhours = parseInt(selectedhours);
        let locationID = response.AllocatedSlotLocation;
        let bookingreff = response.BookingReference;
        let PickerValueHolder = dataSource[0].RFID;
        // console.log("666666666666666"+selectedhours);
        // console.log("response time " + response.DisplayInTime)
        // let startDateTime = new Date(response.DisplayInTime).toISOString();
        let datetime = response.InTime || response.ReservedInTime
        let startDateTime = new Date(datetime)
        let inProgressFlag = response.InTime ? false : true
        // console.log("initial in time " + startDateTime)
        var d = moment(startDateTime).add(selectedhours, 'hours');
        // console.log("out time " + d.toISOString())
        var initialRegion = {
            latitude: dataSourcePL[0].latitude,
            longitude: dataSourcePL[0].longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
        this.setState({ initialPosition: initialRegion })
        this.setState({ markerPosition: initialRegion })
        this.setState({
            dataSource: dataSource,
            dataSourcePL: dataSourcePL,
            date: startDateTime,
            selectedhours: selectedhours,
            isLoadingDatasourcePL: false,
            isLoadingDatasource: false,
            isMarkerLoading: false,
            endDateTime: d.toISOString().substring(0, 19),
            bookingreff: bookingreff,
            PickerValueHolder: PickerValueHolder,
            locationID: locationID,
            inProgressFlag: inProgressFlag,

        })
    }

    _datetimepicker = () => {
        if (Platform.OS == 'ios') {
            this.setState({
                showIOSDateTime: true,
            });
        }
        else {
            DatePickerAndroid.open({
                date: this.state.date,
                minDate: this.state.minDate,

                mode: "calendar"
            }).then(this.afterdateselected);
        }

    }

    datechangeIOS = (event, selectedDate) => {
        var d = moment(selectedDate).add(this.state.selectedhours, 'hours');

        this.setState({
            date: selectedDate,
            endDateTime: d.toISOString().substring(0, 19),

        })


    }

    closeDateTimeIOS() {
        this.setState({
            showIOSDateTime: false
        })
    }

    closepickerIOS() {
        this.setState({
            showIOSpicker: false
        })
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID)
    }

    afterdateselected({ action, year, month, day }) {

        if (action !== DatePickerAndroid.dismissedAction) {

            TimePickerAndroid.open({

                is24Hour: true,
                mode: "clock"
            }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
        }
    }

    onDatetimeTimePicked(year, month, day, { action, hour, minute }) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: new Date(year, month, day, hour, minute)
            });
            // console.log(this.state.date);
            var d = moment(this.state.date).add(this.state.selectedhours, 'hours');
            this.setState({
                endDateTime: d.toISOString().substring(0, 19)
            })
        }
    }

    change(val) {
        var d = moment(this.state.date).add(val, 'hours');
        this.setState(() => {
            return {

                endDateTime: d.toISOString().substring(0, 19),
                selectedhours: val,
            };
        });
    }

    renderSearchModal() {
        if (!this.state.isSearchModalVisible) {
            return null
        }
        console.log("Render Modal opened")

        // let resultStatus = this.state.resultStatus
        // return (
        //     <View style={{
        //         flex: 1,
        //         height: SCREEN_HEIGHT,
        //         width: SCREEN_WIDTH,
        //         backgroundColor: 'blue'
        //     }}>
        //         <Modal
        //             visible={this.state.isSearchModalVisible}
        //             avoidKeyboard={true}
        //         >
        //             <View style={styles.modalContainer}>
        //                 <TouchableWithoutFeedback
        //                     onPress={() => this.setState({ isSearchModalVisible: false })}
        //                 >
        //                     <Icon
        //                         name="close"
        //                         size={30}
        //                         color={"black"}
        //                         fontWeight='light'
        //                         style={{ padding: 12 }}
        //                     // onPress={() => this.setState({ isSearchModalVisible: false })}
        //                     />
        //                 </TouchableWithoutFeedback>

        //                 <View style={styles.searchboxArea}>
        //                     <TextInput
        //                         style={styles.modalSearchTextAreaBox}
        //                         placeholder='Search a Location'
        //                         returnKeyType='search'
        //                         onChangeText={(text) => this.setState({ queryText: text })}
        //                     >

        //                     </TextInput>
        //                     <React.Fragment>
        //                         <TouchableOpacity
        //                             style={styles.submitButton}
        //                             onPress={
        //                                 () => this.searchQuery(this.state.queryText)
        //                                 // () => this.renderSearchResultsList()
        //                             }>
        //                             <Icon name="search" style={{ textAlign: "center", color: 'gray' }}></Icon >

        //                         </TouchableOpacity>
        //                     </React.Fragment>
        //                 </View>


        //                 <ScrollView
        //                     contentContainerStyle={styles.searchResultsArea}>
        //                     {resultStatus ?
        //                         this.renderSearchResultsList() : null}
        //                 </ScrollView>

        //             </View>

        //         </Modal>
        //     </View>
        // )
    }

    async searchQuery(queryText) {
        try {
            console.log("Search Query () called : " + queryText)
            const querySearchResult = await fetch(`https://places.sit.ls.hereapi.com/places/v1/autosuggest?at=12.851802%2C77.660532&q=${queryText}&Accept-Language=en-US%2Cen%3Bq%3D0.9&app_id=gInQRwTcusKrw1m7fCj9&app_code=7FUnG5WX3Hch8xZDmaCVfg`)
            const querySearchResultJSON = await querySearchResult.json()
            console.log("\n\n______________________________________________________\n\n*******************************************************\n\n")
            console.log(JSON.stringify(querySearchResultJSON, null, 2))

            this.setState({
                searchDataSourceResults: querySearchResultJSON.results,
                resultStatus: true
            },
                // console.log("-----------------------------RESULTS MAPPING : ------------------------------"),
                // console.log(JSON.stringify(searchDataSourceResults, null, 2))
            )

            let sampleData = await querySearchResultJSON.results
            // console.log(sampleData[1].title)
            // console.log(this.searchDataSourceResults, null, 2)

            console.log("-----------------------------RESULTS MAPPING : ------------------------------")

            this.setState({ searchDataSourceResults: sampleData })

            {
                this.state.searchDataSourceResults.map((item, index) =>
                    console.log(item.title),
                )
            }

        }
        catch (err) { console.log(err) }

    }

    renderSearchResultsList() {
        return (

            <FlatList
                data={this.state.searchDataSourceResults}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => this.getPlaceDetails(index)}
                        style={styles.searchResultListTouch}  >
                        <View style={{ flexDirection: "row", justifyContent: 'flex-start' }}>
                            <SimpleLineIcons name="location-pin" style={{ alignSelf: "center" }}></SimpleLineIcons>
                            <Text style={{ marginLeft: SCREEN_WIDTH * 0.075 }}>{item.title}{'\n'}{item.vicinity}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        )
    }

    async getPlaceDetails(index) {
        Geolocation.stopObserving()
        this.setState({
            isLoading: true
        })

        let tempPosition = this.state.searchDataSourceResults[index].position
        let tempSearchTitle = this.state.searchDataSourceResults[index].title
        let searchLAT = tempPosition[0]
        let searchLONG = tempPosition[1]
        let searchlatNE = searchLAT + LATITUDE_DELTA / 2
        let searchlongNE = searchLONG + LONGITUDE_DELTA / 2
        let searchlatSW = searchLAT - LATITUDE_DELTA / 2
        let searchlongSW = searchLONG - LONGITUDE_DELTA / 2
        console.log(tempPosition[0])
        console.log(tempPosition[1])

        var searchResultPosition = {
            latitude: searchLAT,
            longitude: searchLONG,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            boundLatNE: searchlatNE,
            boundLongNE: searchlongNE,
            boundLatSW: searchlatSW,
            boundLongSW: searchlongSW,
        }

        // this.setState({
        //     initialPosition: searchResultPosition,
        //     SEARCH: true,
        //     isSearchModalVisible: false

        // })
        console.log("\n\n\nTEST PRINT PRE API CALL" + this.state.initialPosition.boundLatNE)
        try {
            console.log("\n\n\n\n----------------------------Inside Search try--------------------------")
            console.log(this.state.initialPosition.latitude)
            console.log(this.state.initialPosition.longitude)
            console.log(this.state.initialPosition.boundLatNE)
            console.log(this.state.initialPosition.boundLongNE)
            console.log(this.state.initialPosition.boundLatSW)
            console.log(this.state.initialPosition.boundLongSW)
            // const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + this.state.initialPosition.boundLatNE + '&lat2=' + this.state.initialPosition.boundLatSW + '&long1=' + this.state.initialPosition.boundLongNE + '&long2=' + this.state.initialPosition.boundLongSW)
            const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + searchResultPosition.boundLatNE + '&lat2=' + searchResultPosition.boundLatSW + '&long1=' + searchResultPosition.boundLongNE + '&long2=' + searchResultPosition.boundLongSW)

            const responseMarkersJSON = await responseMarkers.json();
            console.log(responseMarkersJSON)
            let sampleData = await responseMarkersJSON.Items
            console.log(sampleData)
            // let sampleData = await responsePLJson.Items

            // let sampleData = this.state.initialPosition
            // console.log("-------------------" + JSON.stringify(sampleData,null,2))

            let markerPrevS = 0


            // sampleData[0].markerStatus = true
            if (sampleData.length != 0) {
                sampleData[0].markerStatus = true
                for (let i = 0; i < sampleData.length; i++) {
                    sampleData[i].markerID = i;
                    sampleData[i].markerStatus = false
                    sampleData[i].latitude = (parseFloat(sampleData[i].LocationDetails.Latitude))
                    sampleData[i].longitude = (parseFloat(sampleData[i].LocationDetails.Longitude))
                    // console.log("\n\n\n\n\nINSIDE FOR LOOP : " + typeof (sampleData[i].latitude) + "   " + (sampleData[i].latitude))
                    // console.log("-------------------" + JSON.stringify(sampleData,null,2))
                }
                this.setState({
                    initialPosition: searchResultPosition,
                    dataSourcePL: sampleData,
                    markerPrev: markerPrevS,
                    SEARCH: true,
                    locationID: sampleData[0].ParkingLocationID,
                    searchDataTitles: tempSearchTitle,
                    isLoading: false,
                    isSearchModalVisible: false,
                })

                // this.setState({
                //     locationID: sampleData[0].ParkingLocationID,
                // })
            }
            else {
                let noParkingLocation = "No Parking Locations Nearby"
                this.setState({
                    initialPosition: searchResultPosition,
                    isSearchModalVisible: false,
                    locationID: noParkingLocation,
                    isLoading: false

                })
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    // async API3_SEARCH_MARKERS() {
    //     try {
    //         console.log("\n\n\n\n----------------------------Inside Search try--------------------------")
    //         const responseMarkers = await fetch('https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/getmarker?lat1=' + this.state.initialPosition.boundLatNE + '&lat2=' + this.state.initialPosition.boundLatSW + '&long1=' + this.state.initialPosition.boundLongNE + '&long2=' + this.state.initialPosition.boundLongSW)
    //         const responseMarkersJSON = await responseMarkers.json();
    //         console.log(responseMarkersJSON)
    //         let sampleData = await responseMarkersJSON.Items
    //         console.log(sampleData)
    //         // let sampleData = await responsePLJson.Items

    //         // let sampleData = this.state.initialPosition
    //         // console.log("-------------------" + JSON.stringify(sampleData,null,2))

    //         let markerPrev = 0

    //         if (sampleData.length != 0) {
    //             for (let i = 0; i < sampleData.length; i++) {
    //                 sampleData[i].markerID = i;
    //                 sampleData[i].markerStatus = false
    //                 sampleData[i].latitude = (parseFloat(sampleData[i].LocationDetails.Latitude))
    //                 sampleData[i].longitude = (parseFloat(sampleData[i].LocationDetails.Longitude))
    //                 // console.log("\n\n\n\n\nINSIDE FOR LOOP : " + typeof (sampleData[i].latitude) + "   " + (sampleData[i].latitude))
    //                 // console.log("-------------------" + JSON.stringify(sampleData,null,2))
    //             }
    //             sampleData[0].markerStatus = true

    //             this.setState({
    //                 locationID: sampleData[0].ParkingLocationID,
    //             })
    //         }
    //         else {
    //             let noParkingLocation = "No Parking Locations Nearby"
    //             this.setState({
    //                 locationID: noParkingLocation
    //             })
    //         }

    //         this.setState({
    //             dataSourcePL: sampleData,
    //             markerPrev: markerPrev,
    //             isLoading: false
    //         })
    //         // this.render()
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    renderHours() {
        return (

            <View style={styles.hoursDropdown}>
                <Text style={styles.hoursTitle}>05:00 hrs</Text>
            </View>
        )
    }

    openPickerIOS() {
        this.setState({
            showIOSpicker: true
        })
    }

    renderContent() {
        // Boolean = this.state;
        if (this.state.isLoadingDatasource) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }

        else {
            // console.log('ENTERING RENDER CONTENT DRAWER')
            const date1 = this.state.date;
            const rfid = this.state.PickerValueHolder;
            const dataSource = this.state.dataSource;
            let count = 0
            for (let i = 0; i < dataSource.length; i++) {
                if (dataSource[i].RFID == rfid) {
                    count = i;
                    break
                }
            }
            const iosVehicleDIsplay = dataSource[count].VehicleDetails.VehicleNumber


            // this.state.dataSource[this.state.PickerValueHolder].VehicleDetails.VehicleNumber;
            // [console.log("picker value after selected"+this.state.PickerValueHolder)]
            // const displayinPicker = this.state.dataSource[this.state.PickerValueHolder].VehicleDetails.VehicleNumber;
            // console.log("qqqqqqqqqqqqqq"+date1)
            const value = this.state.selectedhours;
            const { locationID } = this.state
            this.getAvailableSlots()
            const slotcount = this.state.availableSlots;
            let inprogressFlag = this.state.inProgressFlag;
            const DisplayVehicleNumber = this.state.dataSource[0].VehicleDetails.VehicleNumber
            return (
                <React.Fragment>

                    <TouchableWithoutFeedback>

                        <React.Fragment>
                            <BottomDrawer
                                containerHeight={545}
                                offset={width - (width * .905)}
                                // containerHeight={heightPercentageToDP('55%')}
                                // offset={heightPercentageToDP('5.5%')}
                                startUp={false}
                                shadow={true}
                                marginEnd={25}
                            >
                                <View style={styles.cardPullTag}>
                                    {/* <Ionicons name='ios-arrow-up' ></Ionicons>  */}
                                </View>

                                <View style={styles.cardHeader}>

                                    <View style={[styles.parking, styles.shadow]}>

                                        <View style={styles.drawerParkingInfoLeft}>
                                            <Text style={styles.locationText}>{locationID}</Text>

                                            <View style={styles.parkingSpotsAvailableCounter}>
                                                <Image style={styles.parkingIconImage} source={require('../images/new_Parking.png')} />

                                                <Text style={styles.slotsAvailableText}>{slotcount}{'\n'}Available</Text>
                                            </View>


                                        </View>

                                        <View style={styles.drawerParkingInfoRight}>
                                            <Text style={styles.rateText}>$10 / Hour</Text>
                                            {slotcount == 0 ?
                                                <View style={styles.payBtnDisabled}>
                                                    <Text style={styles.payText}>Book</Text>
                                                </View>
                                                :
                                                <TouchableOpacity style={styles.payBtn} onPress={() => this.navigateToSlot()}>
                                                    <Text style={styles.payText}>Book</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.titleTextStyle}>Vehicle</Text>

                                    {this.props.navigation.state.params.newBooking == true ? Platform.OS == 'ios' ?
                                        <TouchableOpacity onPress={() => this.openPickerIOS()}>
                                            <View style={{ borderWidth: 1, borderRadius: 6, borderColor: 'black', width: width * 0.6 }}>
                                                <Text style={{ fontSize: 16, padding: 14 }}> {iosVehicleDIsplay} </Text>

                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <View style={{ borderWidth: 1, borderRadius: 6, borderColor: 'black', width: width * 0.6 }}>
                                            <Picker
                                                selectedValue={this.state.PickerValueHolder}
                                                style={styles.dropdownPicker}

                                                onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >

                                                {this.state.dataSource.map((item, key) =>
                                                    (
                                                        <Picker.Item label={item.VehicleDetails.VehicleNumber} value={item.RFID} key={item.RFID} />),

                                                )}

                                            </Picker>
                                        </View> :

                                        <View style={{ borderWidth: 1, borderRadius: 6, borderColor: 'black', width: width * 0.6 }}>

                                            <Text style={{ fontSize: 16, padding: 14 }}> {DisplayVehicleNumber} </Text>
                                        </View>
                                    }

                                </View>

                                <View>
                                    <View style={styles.cardContent}>

                                        <Text style={styles.titleTextStyle}>Date and Time</Text>
                                        {inprogressFlag ? <TouchableHighlight onPress={this._datetimepicker} underlayColor="white">
                                            <View style={{
                                                borderColor: 'black',
                                                borderWidth: 1,
                                                borderRadius: 6,
                                                width: width * 0.6,
                                                // padding: 10,
                                                // height: 30
                                            }}>

                                                <Text style={{ fontSize: 16, padding: 14 }}>{date1.toLocaleString()} </Text></View></TouchableHighlight> : <View style={{
                                                    borderColor: 'black',
                                                    borderWidth: 1,
                                                    borderRadius: 6,
                                                    width: width * 0.6,
                                                    // padding: 10,
                                                    // height: 30
                                                }}>

                                                <Text style={{ fontSize: 16, padding: 14 }}>{date1.toLocaleString()} </Text></View>}

                                    </View>

                                    <View style={styles.cardContent}>
                                        <Text style={styles.titleTextStyle}>Select Hours : {String(value)}</Text>
                                        <Slider
                                            style={{ width: 300 }}
                                            step={1}
                                            minimumValue={1}
                                            maximumValue={10}
                                            value={this.state.selectedhours}
                                            onValueChange={

                                                this.change.bind(this)
                                            }
                                            thumbTintColor='rgb(252, 228, 149)'
                                            maximumTrackTintColor='#d3d3d3'
                                            minimumTrackTintColor='rgb(252, 228, 149)'
                                        />
                                        <View style={styles.textCon}>
                                            <Text>1 hr</Text>

                                            <Text>10 hr</Text>
                                        </View>

                                    </View>
                                </View>

                            </BottomDrawer>

                        </React.Fragment>
                    </TouchableWithoutFeedback>

                </React.Fragment>

            )
        }

    }

    renderParking(item) {

        const { hours } = this.state;

        return (

            <TouchableWithoutFeedback key={`parking-${item}`} onPress={() => this.setState({ active: item.id })} >


                <View style={[styles.parking, styles.shadow]}>

                    <View style={styles.hours}>
                        <Text style={theme.SIZES.font}>HOURS * {item.price}</Text>
                    </View>
                    <View style={styles.parkingInfoContainer}>
                        <View style={styles.parkingInfo}>
                            <View style={styles.parkingIcon}>
                                <Ionicons name='ios-pricetag' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                                <Text>{item.price}</Text>
                            </View>
                            <View style={styles.parkingIcon}>
                                <Ionicons name='ios-star' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                                <Text>{item.rating}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeCard: !this.state.activeCard })}>
                            <View style={styles.buyTotal}>
                                <Text style={styles.buyTotalPrice}>RATE</Text>
                            </View>
                            <View style={styles.buyButton}>
                                <MaterialCommunityIcons name='arrow-down-bold-box-outline' color='white' size={40} />

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableWithoutFeedback>
        )
    }

    markerUpdate(details, index) {

        let sampleData = this.state.dataSourcePL
        if (this.state.markerPrev != null) {
            sampleData[this.state.markerPrev].markerStatus = false
            sampleData[index].markerStatus = true


            this.setState({
                locationID: details,
                dataSourcePL: sampleData,
                markerPrev: index
            })
        }
    }

    async getAvailableSlots() {
        // console.log("old date  "+this.state.date)
        // let a = new Date(this.state.date)
        // console.log("aaaaaaaaa "+a)
        // let datetime = a.toISOString()
        let d = moment(this.state.date)
        // console.log("new date time passed " + d)
        const url = "https://djgxox5mle.execute-api.us-east-2.amazonaws.com/test/test-getstatus?LocationID=" + this.state.locationID + "&ReservedFrom=" + d.toISOString().substring(0, 19) + "&ReservedTo=" + this.state.endDateTime.substring(0, 19) + "&RFID=" + null
        let responseSlot = await fetch(url)
        let responseSlotJson = await responseSlot.json()

        // console.log("\n\n\n\n\n\n\n url is " + url);
        // console.log("\n\n\n\n\n\n\nSLOTS URL : " + JSON.stringify(responseSlotJson))
        let count = 0;
        for (let i = 0; i < responseSlotJson.length; i++) {
            if (responseSlotJson[i].ReservationStatus == "Available") {
                count += 1;
            }
        }
        // console.log("count 1111111111111111111111111111        " + count);
        // return count;
        this.setState({
            availableSlots: count
        })

    }

    navigateToSlot() {
        // console.log("without conversion " + this.state.date)
        let d = moment(this.state.date)
        // console.log("reserveInTime " + d.toISOString().substring(0, 19));
        const rfid = this.state.PickerValueHolder;
        const dataSource = this.state.dataSource;
        let count = 0
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].RFID == rfid) {
                count = i;
                break
            }
        }
        const iosVehicleDIsplay = dataSource[count].VehicleDetails.VehicleNumber
        this.props.navigation.navigate('Slot',
            {


                locid: this.state.locationID,
                rfid: this.state.PickerValueHolder,
                VehicleNumber: iosVehicleDIsplay,
                reserveInTime: d.toISOString().substring(0, 19),
                reserveOutTime: this.state.endDateTime,
                Bookingref: this.state.bookingreff || null,
                userid: this.state.userid

            })

    }

    onMapRegionChange(region) {
        this.setState({
            region
        })
    }

    onMapRegionChangeComplete(region) {
        this.setState({
            region
        })
    }

    // onRefreshButtonPress() {
    //     this.setState({
    //         isLoading: false
    //     })

    // }

    refreshComponent() {
        this.setState({
            isLoadingDatasource: true,
            isLoadingDatasourcePL: true
        })
        this.componentDidMount()
    }

    render() {
        // console.log("dsss" + this.state.dataSource)
        // console.log("PLPLPLPL" + this.state.dataSourcePL)

        if (this.state.isLoadingDatasourcePL || this.state.isLoadingDatasource) {
            // console.log("\n\n\n\n---------------------------------ENTERED MAIN RENDER IF---------------------------")

            return (
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("Home")}
                        style={styles.BackNavigationButtonView}>
                        <MaterialIcons
                            name="arrow-back"
                            size={22}
                            style={styles.GPSFloatingButtonStyle}
                        />
                    </TouchableOpacity>
                    <ActivityIndicator size="large" style={styles.activityLoadingSpinner} />
                </View>
            )
        }

        else {
            let resultStatus = this.state.resultStatus
            // console.log("\n\n\n\n---------------------------------ENTERED MAIN RENDER ELSE---------------------------")

            return (
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        // initialRegion={this.state.initialPosition}
                        region={this.state.initialPosition}
                        // region={this.state.initialPosition}
                        showsUserLocation={true}
                        showsCompass={true}
                        showsMyLocationButton={true}
                        onRegionChange={(reg) => { this.onMapRegionChange(reg) }}
                        onRegionChangeComplete={(reg) => { this.onMapRegionChangeComplete(reg) }}
                    >

                        {(this.state.dataSourcePL.map((item, index) => (

                            <TouchableOpacity onPress={() => { this.markerUpdate(item.ParkingLocationID) }}>


                                <Marker
                                    key={(item.markerID)}
                                    coordinate={{
                                        latitude: (item.latitude),
                                        longitude: (item.longitude),
                                    }}
                                    // stopPropagation={true}

                                    onPress={() => { this.markerUpdate(item.ParkingLocationID, index) }}
                                // onSelect={() => { this.markerUpdate(item.ParkingLocationID) }}
                                >

                                    <View style={[
                                        styles.marker,
                                        styles.shadow,
                                        item.markerStatus ? styles.active : null
                                    ]}>

                                        <Text style={[styles.markerStatus, item.markerStatus ? styles.activeText : null]}>{item.ParkingLocationID}</Text>

                                    </View>
                                    {/* {console.log("marker shown --------------\n\n\n\n"+JSON.stringify(item))} */}
                                </Marker>

                            </TouchableOpacity>

                        )))}

                    </MapView>

                    <Modal
                        // animationType="slide"
                        transparent={true}
                        visible={this.state.showIOSDateTime}
                    >
                        <View style={{ backgroundColor: "rgba(52, 52, 52, 0.8)", alignSelf: "center", alignContent: "center", flexDirection: "column", width: width, height: height }}>
                            <View style={{ marginTop: height * 0.4, borderRadius: 6, backgroundColor: "white", width: width - 40, alignSelf: "center", height: 250 }}>
                                <DateTimePicker
                                    value={this.state.date}
                                    minimumDate={new Date}
                                    is24Hour={true}
                                    mode='datetime'
                                    display="default"
                                    onChange={this.datechangeIOS}
                                />
                                <TouchableOpacity onPress={() => this.closeDateTimeIOS()}>
                                    <Text style={{ fontSize: 20, alignSelf: "flex-end", paddingRight: 10 }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        // animationType="slide"
                        transparent={true}
                        visible={this.state.showIOSpicker}
                    >
                        <View style={{ backgroundColor: "rgba(52, 52, 52, 0.8)", alignSelf: "center", alignContent: "center", flexDirection: "column", width: width, height: height }}>
                            <View style={{ marginTop: height * 0.4, borderRadius: 6, backgroundColor: "white", width: width - 40, alignSelf: "center", height: 270 }}>
                                <Picker
                                    selectedValue={this.state.PickerValueHolder}
                                    style={styles.dropdownPicker}

                                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >

                                    {this.state.dataSource.map((item, key) =>
                                        (
                                            <Picker.Item label={item.VehicleDetails.VehicleNumber} value={item.RFID} key={item.RFID} />),


                                    )}

                                </Picker>
                                <TouchableOpacity onPress={() => this.closepickerIOS()}>
                                    <Text style={{ fontSize: 20, alignSelf: "flex-end", paddingRight: 10 }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        // animationIn="fadeInUp"
                        animationInTiming={10000}
                        visible={this.state.isSearchModalVisible}
                        avoidKeyboard={true}
                        onBackButtonPress={() => this.setState({ isSearchModalVisible: false })}
                        coverScreen={true}
                        style={styles.modalContainer}

                    >

                        {/*                            <View style={styles.modalContainer}>
                                        */}
                        <Icon
                            name="close"
                            size={30}
                            color={"black"}
                            fontWeight='light'
                            style={{ padding: 15 }}
                            onPress={() => this.setState({ isSearchModalVisible: false })}

                        />

                        <View style={styles.searchboxArea}>
                            <TextInput
                                style={styles.modalSearchTextAreaBox}
                                placeholder='Search a Location'
                                returnKeyType='search'
                                onSubmitEditing={() => this.searchQuery(this.state.queryText)}
                                onChangeText={(text) => this.setState({ queryText: text })}
                            >

                            </TextInput>
                            <React.Fragment>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={
                                        () => this.searchQuery(this.state.queryText)
                                    }>
                                    <Icon name="search" style={{ textAlign: "center", color: 'gray' }}></Icon >

                                </TouchableOpacity>
                            </React.Fragment>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.searchResultsArea}>
                            {resultStatus ?
                                this.renderSearchResultsList() : null}
                        </ScrollView>

                        {/*</View> */}
                    </Modal>

                    <TouchableOpacity style={styles.searchHeader} onPress={() => this.setState({ isSearchModalVisible: true })}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                            <Icon name="search"
                                size={15}
                                style={{ marginLeft: SCREEN_WIDTH * 0.03, marginRight: SCREEN_WIDTH * 0.03, color: 'gray' }}
                            // style={{ textAlign: "center", color: 'gray' }}
                            >
                            </Icon >
                            <TextInput
                                style={{ justifyContent: "space-evenly", color: 'black' }}
                                // style={styles.searchBoxContentLeft}
                                editable={false}
                                // value={this.state.queryText}
                                value={this.state.searchDataTitles}
                                placeholder="Search a Parking Location"
                            >
                            </TextInput>
                        </View>

                        {/*  */}
                        <SimpleLineIcons name="location-pin" style={styles.searchBoxContentRight}></SimpleLineIcons>

                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.refreshComponent()}
                        style={styles.RefreshButtonView}>
                        <MaterialIcons
                            name="refresh"
                            size={22}
                            style={styles.GPSFloatingButtonStyle}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("Home")}
                        style={styles.BackNavigationButtonView}>
                        <MaterialIcons
                            name="arrow-back"
                            size={22}
                            style={styles.GPSFloatingButtonStyle}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.getCurrentGPSPosition_ANDROID_TEST()}
                        style={styles.GPSLocationButtonView}>
                        <MaterialIcons
                            name="gps-fixed"
                            size={22}
                            style={styles.GPSFloatingButtonStyle}
                        />
                    </TouchableOpacity>
                    {this.renderContent()}

                </View >
            );
        }

    }
}

const styles = StyleSheet.create({
    activityLoadingSpinner: {
        flex: 1,
        // position: "absolute",
        alignItems: 'center',
        // height: '100%',
        // width: '100%',
        alignSelf: "center",
        alignContent: "center",
        // maxHeight:SCREEN_HEIGHT * 0.95,
        // color: 'gray',
        backgroundColor: theme.COLORS.white
    },

    container: {
        flex: 1,
        // position: "absolute",
        height: '100%',
        width: '100%',
        // maxHeight:SCREEN_HEIGHT * 0.95,
        backgroundColor: theme.COLORS.white
    },

    RefreshButtonView: {
        position: "absolute",
        width: 37,
        height: 37,
        alignItems: "center",
        justifyContent: "center",
        //top:450,
        right: widthPercentageToDP('3%'),
        //marginBottom:height*.01,
        bottom: heightPercentageToDP('34%'),
        borderRadius: 50,
        borderColor: "gray",
        borderWidth: 1,
        zIndex: 0,
        backgroundColor: "white",
    }

    , GPSLocationButtonView: {
        position: "absolute",
        width: 37,
        height: 37,
        alignItems: "center",
        justifyContent: "center",
        //top:450,
        right: widthPercentageToDP('3%'),
        //marginBottom:height*.01,
        bottom: heightPercentageToDP('27%'),
        borderRadius: 50,
        borderColor: "gray",
        borderWidth: 1,
        zIndex: 0,
        backgroundColor: "white",
    },

    BackNavigationButtonView: {
        position: "absolute",
        width: 37,
        height: 37,
        alignItems: "center",
        justifyContent: "center",
        //top:450,
        left: widthPercentageToDP('3%'),
        //marginBottom:height*.01,
        bottom: heightPercentageToDP('94.5%'),
        borderRadius: 50,
        borderColor: "gray",
        borderWidth: 1,
        zIndex: 0,
        backgroundColor: "white",
    },

    GPSFloatingButtonStyle: {
        // width:40,
        // height:40,
        zIndex: 0,
        color: "gray",
        // paddingLeft:7,
        // paddingTop:5
        alignItems: "center",
        justifyContent: "center"
    },

    // BackNavigationFloatingButtonStyle: {
    //     // width:40,
    //     // height:40,
    //     zIndex: 0,
    //     color: "gray",
    //     // paddingLeft:7,
    //     // paddingTop:5
    //     alignItems: "center",
    //     justifyContent: "center"
    // },

    searchTextBox: {
        elevation: 1,
        width: '99%',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: theme.SIZES.base * 2,
        paddingTop: theme.SIZES.base * 1.5,
        paddingBottom: theme.SIZES.base * 1,
    },
    headerTitle: {
        color: theme.COLORS.gray,
    },

    headerLocation: {
        fontSize: theme.SIZES.font,
        fontWeight: '500',
        paddingVertical: theme.SIZES.base / 3,
    },

    headerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    headerLocationInfo: {
        flex: 1,
        justifyContent: 'center'
    },

    map: {
        position: 'absolute',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    drawerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        // bottom: 1,
    },

    textInput: {
        height: 40,
        width: 450,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'lightgray',
        backgroundColor: 'lightgray',
        paddingHorizontal: 16,
    },

    // inputWrapper: {
    //     marginTop: 10,
    //     // flexDirection: 'row'
    // },

    cardPullTag: {

        height: '.75%',
        maxWidth: 50,
        borderRadius: 100,
        backgroundColor: theme.COLORS.gray,
        borderWidth: 1,
        borderColor: theme.COLORS.gray,
        // top: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '45%',
        marginEnd: 50,
        marginTop: '2%',
        marginBottom: '5%',
        textAlign: 'center',
        // flexDirection: 'row',
    },

    cardHeader: {
        height: SCREEN_HEIGHT - (SCREEN_HEIGHT * 0.860),
        // backgroundColor: 'black',
        borderTopEndRadius: 6,
        top: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    cardContent: {
        alignItems: 'center',
        marginTop: 15
    },

    textCon: {
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    dropdownPicker: {
        // borderRadius: 6,
        // width: width * 2,
        padding: 10,
        //  height:100
        // paddingLeft: 100
    },

    parkings: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 1,
        paddingTop: 0.5,
        // bottom: theme.SIZES.base * 2,
        //  bottom: 1,
        // paddingBottom: theme.SIZES.base * 1
    },

    parking: {
        flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        // backgroundColor: 'black',
        // borderColor: '#3D4448',
        // borderRadius: 10,
        // borderWidth: 2,
        // alignItems: 'baseline',
        // padding: theme.SIZES.base,
        // paddingLeft: 5,
        // paddingRight:5,
        alignSelf: 'center',
        // marginHorizontal: theme.SIZES.base * 2,
        // width: width - (24 * 2),
        width: '90%',
        height: "110%",
        // marginTop
    },

    buy: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: theme.SIZES.base * 1.5,
        paddingVertical: theme.SIZES.base * 2,
        backgroundColor: theme.COLORS.black,
        borderColor: theme.COLORS.black,
        // borderWidth: 2,
        borderRadius: 10,
    },
    UserMarker: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'rgb(71, 191, 255)',
        padding: 10,
        margin: 25
    },
    marker: {
        // flexDirection: 'row',
        backgroundColor: theme.COLORS.white,
        // borderRadius: theme.SIZES.base * 2,
        borderRadius: 100,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderWidth: 3,
        borderColor: theme.COLORS.gray,
        textAlign: 'center'
    },

    markerPrice: {
        color: theme.COLORS.red,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    markerStatus: {
        color: theme.COLORS.gray
    },

    shadow: {
        shadowColor: theme.COLORS.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // backgroundColor : '#FFFFFF',
        // elevation : 15
    },

    active: {
        backgroundColor: theme.COLORS.gray,
        // borderColor: theme.COLORS.gray,
        // backgroundColor: 'rgb(255, 198, 10)',
        borderColor: 'rgb(255, 198, 10)',
    },

    activeText: {
        color: theme.COLORS.white,
        // color: theme.COLORS.gray,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    hours: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: theme.SIZES.base / 2,
        justifyContent: 'space-evenly',
    },

    hoursTitle: {
        fontSize: theme.SIZES.text,
        fontWeight: '500',
    },

    parkingInfoContainer: {
        flex: 2.5,
        flexDirection: 'row'
    },

    parkingInfo: {
        justifyContent: 'space-evenly',
        flex: 2
    },

    parkingIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    drawerParkingInfoLeft: {
        flexDirection: 'column',
        // justifyContent: 'space-between',
        // marginHorizontal: 10,
        // backgroundColor: theme.COLORS.white,
        // backgroundColor: 'green',
        // height: 100,
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        width: '60%',
        height: '100%',
        // padding: 20,
        // margin: 1
    },

    drawerParkingInfoRight: {
        flexDirection: 'column',
        // justifyContent: 'space-between',
        // marginHorizontal: 10,
        // backgroundColor: theme.COLORS.white,
        // backgroundColor: 'blue',
        height: '100%',
        width: '40%',
        alignSelf: 'flex-end',
        alignContent: "center",
        // padding: 20,
        marginLeft: '2%'
    },

    locationText: {
        flexDirection: 'column',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: '7%',
        color: 'black'
    },

    slotsAvailableText: {
        fontSize: 20,
        color: 'white',
        alignSelf: "flex-end",
        // marginTop: '90%',
        marginBottom: heightPercentageToDP('3%')
        // marginHorizontal: 9

    },

    rateText: {
        fontSize: 19,
        alignSelf: 'flex-start',
        marginTop: 25,
        // marginHorizontal: 10
    },

    parkingIconImage: {
        height: heightPercentageToDP('10%'),
        width: widthPercentageToDP('15%'),
        // resizeMode: "contain",
        marginRight: 10,
    },

    parkingSpotContainer: {
        // flexDirection: "column",
        alignSelf: "center",
        alignContent: "center",
        alignItems: "flex-end",
        height: '60%',
        width: '80%',
        // backgroundColor: 'red',
        // top: '70%'
        // marginVertical: '5%'

    },

    parkingSpotsAvailableCounter: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        // alignContent: 'center',
        backgroundColor: 'rgb(50,50,50)',
        height: heightPercentageToDP('10%'),
        width: widthPercentageToDP('40%'),
        marginVertical: '4.0%',
        marginLeft: '5%'
    },
    buyTotal: {
        flex: 1,
        justifyContent: 'space-evenly'
    },

    buyButton: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    buyTotalPrice: {
        color: theme.COLORS.white,
        fontSize: theme.SIZES.base * 2,
        fontWeight: '600',
        paddingLeft: theme.SIZES.base / 4,
    },

    modal: {
        elevation: 1,
        flexDirection: 'column',
        height: SCREEN_HEIGHT * 0.5,
        padding: theme.SIZES.base * 2,
        // width : width,
        backgroundColor: 'red',
        borderTopLeftRadius: theme.SIZES.base,
        borderTopRightRadius: theme.SIZES.base,
    },

    modalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: theme.SIZES.base,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: theme.COLORS.overlay,
        borderBottomColor: theme.COLORS.overlay,
    },

    modalHours: {
        paddingVertical: height * 0.15,
    },

    modalHoursDropdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.SIZES.base,
    },

    backBtn: {
        borderRadius: 8,
        height: 85,
        flexDirection: 'row',
        alignItems: 'center',
        width: 160,
        alignSelf: "auto",
        justifyContent: 'center',
        padding: theme.SIZES.base * 1.75,
        backgroundColor: theme.COLORS.white,
        borderColor: theme.COLORS.black,
        borderWidth: 2,
        marginHorizontal: 15,
        marginTop: 20
    },

    payBtn: {
        height: '50%',
        borderRadius: 8,
        // flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "flex-start",
        // width: 160,
        width: '90%',
        justifyContent: 'center',
        padding: theme.SIZES.base * 1.75,
        backgroundColor: 'rgb(255, 198, 10)',
        // backgroundColor: 'purple',
        borderColor: 'rgb(255, 198, 10)',
        borderWidth: 2,
        marginVertical: "10%"

        // marginHorizontal: 15,
        // marginTop: 20
    },

    payBtnDisabled: {
        height: '50%',
        borderRadius: 8,
        // flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "flex-start",
        // width: 160,
        width: '90%',
        justifyContent: 'center',
        padding: theme.SIZES.base * 1.75,
        backgroundColor: 'gray',
        // backgroundColor: 'purple',
        borderColor: 'gray',
        borderWidth: 2,
        marginVertical: "10%"

        // marginHorizontal: 15,
        // marginTop: 20
    },

    payText: {
        fontWeight: 'bold',
        fontSize: theme.SIZES.base * 1.65,
        color: theme.COLORS.black,
        alignSelf: 'center',
        // margin: 20
    },

    hoursDropdownStyle: {
        marginLeft: -theme.SIZES.base,
        paddingHorizontal: theme.SIZES.base / 2,
        marginVertical: -(theme.SIZES.base + 1),
    },
    hoursDropdown: {
        borderRadius: theme.SIZES.base / 2,
        borderColor: theme.COLORS.overlay,
        borderWidth: 1,
        paddingHorizontal: theme.SIZES.base,
        paddingVertical: theme.SIZES.base / 1.5,
        marginRight: theme.SIZES.base / 2,
    },

    //ParkinSpotDetails
    containerPS: {
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
        height: height * 0.1,
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 30
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
    searchHeader: {
        flex: 1,
        flexDirection: "row",
        top: SCREEN_HEIGHT * 0.065,
        position: "absolute",
        elevation: 1,
        alignSelf: 'center',
        alignItems: "center",
        height: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: 'white',
        // marginTop: 30,
        borderRadius: 5,
        borderColor: 'gray',
        shadowOpacity: 10,
        shadowRadius: 15,
        shadowColor: 'black',
        justifyContent: "space-between",
        shadowOffset: { height: 10, width: 10 }

    },

    modalContainer: {
        // flex: 1,
        // flexDirection: "row",
        // maxHeight: SCREEN_HEIGHT,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        // bottom: -1,
        // top: 1,
        // elevation: 1,
        position: "absolute",
        backgroundColor: 'white',
        alignSelf: "center",
        alignContent: "center",
        flexDirection: "column",
    },

    modalSearchTextAreaBox: {
        flexDirection: "row",
        // elevation: 1,
        alignSelf: 'center',
        // alignItems: "center",
        height: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.8,
        backgroundColor: 'white',
        // marginTop: 30,
        paddingLeft: SCREEN_WIDTH * 0.025,
        borderRightColor: 'gray',
        borderLeftColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 0.55,
        borderRadius: 3,
        // borderColor: 'gray',
        shadowOpacity: 10,
        shadowRadius: 15,
        shadowColor: 'gray',
        // justifyContent: "center",
        shadowOffset: { height: 10, width: 10 }
    },

    searchboxArea: {
        top: SCREEN_HEIGHT * 0.01,
        elevation: 1,
        flexDirection: "row",
        // backgroundColor: 'red',
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "space-between",
        // borderRadius: 5,
        borderColor: 'gray',
        marginBottom: SCREEN_HEIGHT * 0.02
    },

    submitButton: {
        // backgroundColor: 'gray',
        // alignContent:"center",
        // alignItems:"center",
        justifyContent: "center",
        borderRightColor: 'gray',
        borderLeftColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        borderLeftWidth: 0.55,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderRadius: 3,
        height: (SCREEN_HEIGHT * 0.05),
        width: (SCREEN_HEIGHT * 0.05),
    },
    submitButtonText: {
        color: 'white'
    },

    searchBoxContentLeft: {
        marginLeft: SCREEN_WIDTH * 0.01,
    },
    searchBoxContentRight: {
        marginRight: SCREEN_WIDTH * 0.025,
        color: 'gray',
    },

    searchResultsArea: {
        // top: SCREEN_HEIGHT * 0.015,
        marginTop: SCREEN_HEIGHT * 0.025,
        width: SCREEN_WIDTH * 0.85,
        flexDirection: "row",
        // backgroundColor: 'red',
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "space-between",
    },

    searchResultListTouch: {
        width: SCREEN_WIDTH * 0.90,
        height: SCREEN_HEIGHT * 0.0725,
        justifyContent: "center",
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    },

    inputWrapper: {
        // marginTop: 10,
        // top: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(52,52,52,0.0)',
        padding: 10,
        // alignItems
    },
});