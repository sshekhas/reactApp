import React, { Component } from 'react';

import {
  Keyboard,
//   LayoutAnimation,
  View,
  Dimensions,
//   ViewPropTypes,
  Platform,
//   StyleSheet
} from 'react-native';






export default class Keyboardview extends Component {
  

  

  constructor(props) {
    super(props);
    this.state = {
      keyboardSpace: 0,
      isKeyboardOpened: false
    };
    this._listeners = null;
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  componentDidMount() {
    const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    this._listeners = [
      Keyboard.addListener(updateListener, this.updateKeyboardSpace),
      Keyboard.addListener(resetListener, this.resetKeyboardSpace)
    ];
  }

 

  updateKeyboardSpace(event) {
    if (!event.endCoordinates) {
      return;
    }

    

    // get updated on rotation
    const screenHeight = Dimensions.get('window').height;
    // when external physical keyboard is connected
    // event.endCoordinates.height still equals virtual keyboard height
    // however only the keyboard toolbar is showing if there should be one
    const keyboardSpace = (screenHeight - event.endCoordinates.screenY);
    this.setState({
      keyboardSpace,
      isKeyboardOpened: true
    });
  }

  resetKeyboardSpace(event) {
    

    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }

  render() {
    return (
      <View style={{ height: this.state.keyboardSpace }} />);
  }
}

  

  

 