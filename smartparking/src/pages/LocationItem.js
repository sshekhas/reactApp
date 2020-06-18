import React, { PureComponent } from 'react';
import { View, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';

class LocationItem extends PureComponent {
    _handlePress = async () => {
        const res = await this.props.fetchDetails(this.props.place_id)
        console.log('result : ', JSON.stringify(res, null, 2))
        console.log(" Coordinates  : ", + parseFloat(res.geometry.location.lat))
    }

    render() {
        return (
            <TouchableOpacity style={styles.root} onPress={this._handlePress}>
                <Text>{this.props.description}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        // height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray',
        paddingVertical: 10,
        justifyContent: 'center',
        paddingHorizontal: 20
    }
})

export default LocationItem;