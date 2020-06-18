import React, { useState } from 'react';
import { Text, Dimensions, View, Image, KeyboardAvoidingView, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Modal } from 'react-native';
// import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './GlobalStyle'
import moment from 'moment'
import Keyboardview from './keybordpopup'
// import Keyboardview2 from './keybordpopup'
import PropTypes from 'prop-types'
import { NavigationEvents } from 'react-navigation'
import HomeScreen from './HomeScreen'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
//import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
// import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
// var ratingJson = [{ color: "gray", review: "Very Bad" }, { color: "gray", review: "Bad" }, { color: "gray", review: "Okay" }, { color: "gray", review: "Good" }, { color: "gray", review: "Great" }]
const catArray = ["service", "maintenance", "technology", "others"];

export default class FeedbackIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            modalVisible: true,
            insideModal: false,
            feedBackforreff: '',
            feedbackforRfid: '',
            commentstring: '',
            ratingString: ' ',
            selected: [false, false, false, false],
            prevIndex: null,
            catString: '',
            count: -1,
            check: '',
            ratingJson : [{ color: "gray", review: "Very Bad" }, { color: "gray", review: "Bad" }, { color: "gray", review: "Okay" }, { color: "gray", review: "Good" }, { color: "gray", review: "Great" }]
        };
    }

    async componentDidMount() {
        try {
            const url = "https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/parkinghistory/feedback?bookingref=" + this.props.bookreff + "&rfid=" + this.props.rfid
            const response = await fetch(url);
            const responseJson = await response.json();
            
            if (responseJson != null) {
                this.setState({

                    dataSource: responseJson.M
                });
                console.log("inside mount of feedback")
                console.log(JSON.stringify(responseJson.M));
                let { count } = this.state;
                let { dataSource } = this.state;
                let rating = dataSource.Rating.S
                console.log("ratingjson "+ JSON.stringify(this.state.ratingJson))
                let ratingJson = this.state.ratingJson
                for (let i = 0; i < 5; i++) {
                    if (ratingJson[i].review == rating)
                        count = i;
                }
                // if(this.state.count!=-1)
                    this.setReview(count);
                let catstring = dataSource.Category.S.split(" ");
                let selectedcopy = this.state.selected;
                catstring.forEach(element => {
                    if (element.trim() == "service") {

                        selectedcopy[0] = true

                    }
                    else if (element.trim() == "maintenance") {

                        selectedcopy[1] = true

                    }
                    else if (element.trim() == "technology") {

                        selectedcopy[2] = true

                    }
                    else if (element.trim() == "others") {

                        selectedcopy[3] = true

                    }

                });

                this.setState({
                    count,

                    commentstring: dataSource.Comment.S,
                    selected: selectedcopy,
                    isLoading: false,
                    insideModal:this.props.insideModal
                });
            }
            else {
                console.log(JSON.stringify(this.state.dataSource))
                this.setState({
                  isLoading:false,
                  insideModal:this.props.insideModal
                })
            }
            // if(datasource)

        }
        catch (error) {
            console.log(error);
        }
    }
    setModalVisible() {
        this.setState({
            insideModal: true,
            
        });

    }

    onClickItem(index) {

        console.log("entered into onclick")
        let selectedcopy = this.state.selected;
        selectedcopy[index] = !selectedcopy[index]
        this.setState({
            selected: selectedcopy
        });


    }
    closeModal() {
        let ratingJson = this.state.ratingJson
        for (let i = 0; i < 5; i++) {
            ratingJson[i].color = "gray"
        }
        let selectedcopy = this.state.selected;
        for (let i = 0; i < 4; i++) {
            selectedcopy[i] = false
        }

        this.setState({
            modalVisible: false,
            feedBackforreff: '',
            feedbackforRfid: '',
            selected: selectedcopy,
            ratingJson:ratingJson

        })
        this.updateHistory(this.props.index);
    }
    updateHistory(index)
    {
        console.log("inside redux")
        this.props.updateparentstate(index);
    }

    setReview(index) {
        let ratingJson = this.state.ratingJson
        // ratingJson2 = ratingJson
        // ratingJson2[index].color = "yellow"

        // let {ratingJson2} = this.state
        console.log("ratingJson review k andr ka index "+index)
        console.log(JSON.stringify(ratingJson,null,2))
        for (let i = 0; i <= index; i++) {
            ratingJson[i].color = "#FFC107"

        }
        for (let i = 4; i > index; i--) {
            ratingJson[i].color = "gray"
        }

        if(index!=-1)
        {
            this.setState({
                ratingJson:ratingJson,
                ratingString: ratingJson[index].review
            });
        }
        else
        {
            this.setState({
                ratingJson:ratingJson,
               
            });
        }
        
    }
    genetateCategoryString() {
        let selectedcopy = this.state.selected;
        let catString1 = '';
        for (let i = 0; i < 4; i++) {
            if (selectedcopy[i]) {
                catString1 = catString1 + " " + catArray[i];
                console.log(catString1)
            }
        }

        //  this.setState({
        //     catstring:catString1
        // });
        return catString1
    }
    async PostFeedback() {
        let catstring = this.genetateCategoryString()

        // let catstring= await this.state.catString
        console.log(this.state.feedBackforreff)
        console.log(this.state.feedbackforRfid)
        console.log(catstring)
        console.log(this.state.commentstring)
        console.log(this.state.ratingString)





        const url = "https://qn1v75kue5.execute-api.us-east-2.amazonaws.com/Smart-Parking/parkinghistory/feedback?BookingReference=" + this.props.bookreff + "&RFID=" + this.props.rfid + "&Category=" + catstring + "&Comment=" + this.state.commentstring + "&Rating=" + this.state.ratingString


        fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // BookingReference=this.state.feedBackforreff,
                // RFID=this.state.feedbackforRfid,
                // Category=this.state.catString,
                // Comment=this.state.commentstring,
                // Rating=this.state.ratingString
            }),
        })
            .then(res => res.json())
            .then((res) => {
                this.setState({
                    check: JSON.stringify(res)
                });
                console.log("Successfully updated" + this.state.check)
            },
                (error) => {
                    console.log(" Update failed" + error)
                });
                let ratingJson= this.state.ratingJson
        for (let i = 0; i < 5; i++) {
            ratingJson[i].color = "gray"
        }
        let selectedcopy1 = this.state.selected;
        for (let i = 0; i < 4; i++) {
            selectedcopy1[i] = false
        }

        this.setState({
            modalVisible: false,
            feedBackforreff: '',
            feedbackforRfid: '',
            selected: selectedcopy1,
            ratingJson:ratingJson

        })
          this.updateHistory(this.props.index);


    }


    render() {

        if (this.state.isLoading) {
            return (
                
                null
            )
        }
        else {
            console.log("inside else")
            const selected = this.state.selected;
            const { ratingString } = this.state
            return (
                <View>
                {
                    !this.props.insideModal?<TouchableOpacity
                    onPress={() => {
                        this.setModalVisible()
                    }}>
                    {
                        this.state.dataSource != null ? <View style={{ alignItems: "flex-end", paddingTop: 15 }}>
                                            
                    
                          <View style={{


                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            {(this.state.ratingJson.map((item, index) => (
                                <Icon
                                    name="star"
                                    size={20}
                                    color={this.state.count==-1?"gray":index > this.state.count ? "gray" : "#FFC107"}
                                    style={{ paddingLeft: 5 }}

                                />

                            )
                            ))}
                        </View>
                        </View>:<View style={{ alignItems: "flex-end", paddingTop: 15 }}><Text style={{ fontSize: 20, color: "blue", fontWeight: "bold" }}> Give Feedback</Text></View>}
                        </TouchableOpacity>:null
                }
                    {
                        this.state.insideModal ? <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                    // presentationStyle="formSheet"
                    >
                    
                    <View style={{ backgroundColor: "rgba(52, 52, 52, 0.8)", alignSelf: "center",alignContent:"center",flexDirection:"column-reverse", width: width, height:height }}>
                    <View style={{height:height*0.03}}>
                            </View>
                            <Keyboardview/>
                    <View style={{ marginBottom:10, padding:5,paddingBottom:0, backgroundColor: "white", alignSelf: "center", width: width - 40, borderRadius: 9 }}>

                    <View style={{ alignItems: "center", flexDirection: 'row', width: width - 30 }}>

                        <Icon
                            name="close"
                            size={30}
                            color={"black"}
                            // style={{paddingLeft:20}}
                            onPress={() => this.closeModal()}
                        />

                        <Text style={{ paddingLeft: (width - 30) / 2 - 90, color: "black", fontWeight: "bold", fontSize: 20 }}> Feedback</Text>

                    </View>
                    <View style={{fontSize: 20,
                        flexDirection:'row',
                        justifyContent:'space-between',padding:10}}>
                    <Text style={styles.slotLocation}>{this.props.locationDetails}</Text>
                   
                    <View style={styles.slotBackground}>
                      <Text style={styles.slot}>{this.props.slotName}</Text>
                    </View>

                  </View>

                       

                            
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 60 }}>
                                <View style={{ paddingTop: 10, alignItems: 'baseline', marginLeft: 10 }}>

                                    <Text style={{ fontSize: 15, paddingLeft: 8 }}>{moment(this.props.InTime.split('T')[0].trim()).format('DD MMM')}</Text>

                                    <Text style={{ fontSize: 15,paddingLeft:12 }}>{this.props.InTime.split('T')[1].trim()}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 15 }}>{this.props.VehicleNumber}</Text>
                                </View>
                                <View style={{ paddingTop: 10, alignItems: 'baseline' }}>
                                    <Text style={{ fontSize: 15, paddingLeft: 8 }}>{moment(this.props.OutTime.split('T')[0].trim()).format('DD MMM')}</Text>
                                    <Text style={{ fontSize: 15, paddingLeft:12 }}>{this.props.OutTime.split('T')[1].trim()}</Text>
                                </View>
                            </View>


                            <View style={{ alignItems: "center", padding: 15}}>
                                <Text style={{ fontSize: 20, color: "black" }}>
                                    How was your Experience?</Text>

                                <View style={{
                                    margin: 15,
                                    marginTop:10,
                                    marginBottom: 5,
                                    flexDirection: 'row',
                                    alignContent:"center",
                                    justifyContent: 'space-between'
                                }}>
                                    {(this.state.ratingJson.map((item, index) => (
                                        <Icon
                                            name="star"
                                            size={40}
                                            color={item.color}
                                            style={{ padding: 10,paddingBottom:0,paddingTop:0 }}
                                            onPress={() => this.setReview(index)}
                                        />

                                    )
                                    ))}

                                </View>
                                <Text style={{ fontSize: 20, color: "#FFC107", fontWeight: "bold" }}>{ratingString}</Text>
                                <Text style={{ fontSize: 20, marginTop: 15, color: "black" }}>
                                    What did you like?</Text>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <TouchableOpacity style={selected[0] ? styles.selected : styles.notselected} onPress={() => this.onClickItem(0)}>
                                        <Text style={styles.buttonText}>SERVICE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={selected[1] ? styles.selected : styles.notselected} onPress={() => this.onClickItem(1)}>
                                        <Text style={styles.buttonText}>MAINTENANCE</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <TouchableOpacity style={selected[2] ? styles.selected : styles.notselected} onPress={() => this.onClickItem(2)}>
                                        <Text style={styles.buttonText}>TECHNOLOGY</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={selected[3] ? styles.selected : styles.notselected} onPress={() => this.onClickItem(3)}>
                                        <Text style={styles.buttonText}>OTHERS</Text>
                                    </TouchableOpacity>

                                </View>

                                {this.state.commentstring !== "NA" ? <TextInput

                                    style={{ height: 50, width: width - 100, margin: 10, borderBottomWidth: 2, borderRadius: 6, borderColor: "black" }}
                                    defaultValue={this.state.commentstring}
                                    placeholder="Add Comment"
                                    onChangeText={(commentstring) => this.setState({ commentstring })}
                                /> : <TextInput

                                        style={{ height: 60, width: width - 100, margin: 30, borderBottomWidth: 2, borderRadius: 6, borderColor: "black" }}

                                        placeholder="Add Comment"
                                        onChangeText={(commentstring) => this.setState({ commentstring })}
                                    />}
                                <TouchableOpacity style={{ backgroundColor: '#FFC107', height: 50, width: 100, borderRadius: 10, borderColor: 'black' }} onPress={() => this.PostFeedback()}>
                                    <Text style={{ fontSize: 20, alignSelf: 'center', paddingTop: 10 }}>Submit</Text>
                                </TouchableOpacity>
                               
                                
                            </View>
                            </View>
                            
                            </View>
                            
                    </Modal>
                             : null}

                        
                       
                </View>

            )


        }
    }

}

// FeedbackIcon.propTypes =
// {
//     bookreff: PropTypes.string,
//     rfid: PropTypes.string,
// }
