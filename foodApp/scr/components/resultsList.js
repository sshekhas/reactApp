import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ResultsDetail from './resultDetails'

import { withNavigation } from 'react-navigation';
const ResultsList = ({ title, results, navigation }) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator = {false}
                data={results}
                keyExtractor={result => result.restaurant.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                        onPress={() => navigation.navigate('ResultsShow', {id: item.restaurant.id})}
                      >
                        <ResultsDetail result={item.restaurant} />
                        </TouchableOpacity>
                        )
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 5,
        marginTop: 5
    }
});

export default withNavigation(ResultsList);
