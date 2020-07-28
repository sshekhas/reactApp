import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import SearchBar from '../components/searchBar'
import useResults from '../hooks/useResults'
import ResultsList from '../components/resultsList'
const searchScreen = () => {
    const [term, setTerm] = useState('');
    const [result, searchApi, errMsg] = useResults();

    const filterResultsByPrice = price => {
        // price === '2' || '3' || '4'
        return result.filter(result => {
            return result.restaurant.price_range === price;
        });
    };

    return (
        <View style={styles.background}>
            <SearchBar
                term={term}
                onTermChange={newTerm => setTerm(newTerm)}
                onTermSubmit={() => searchApi(term)} />
            <ScrollView>
                {errMsg ? <Text> {errMsg} </Text> : <View><ResultsList results={filterResultsByPrice(2)} title='Cost Effective'  />
                    <ResultsList results={filterResultsByPrice(3)} title='Bit Pricier'  />
                    <ResultsList results={filterResultsByPrice(4)} title='Big Spender'  />
                </View>}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        flex: 1
    }

})

export default searchScreen;
