import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import zomato from '../api/zomato'
const resultsShowScreen = ({ navigation }) => {
    const [results, setResults] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const id = navigation.getParam('id')
    // console.log(id)
    const getResult = async id => {
        try{
        const response = await zomato.get(`/restaurant?res_id=${id}`)
        // console.log(response.data.thumb);
        setResults(response.data)
        
        }
        catch(err)
        {
            console.log(err);
            setErrMsg(err);
        }
      };
      useEffect(() => {
        getResult(id);
      }, []);
  return (
    <View style={styles.container}>
    {errMsg?<Text>something went wrong</Text>:<Text>loaded {results.length}</Text>}
    </View>
            
  );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15
      },
      image: {
        width: 'auto',
        height: 120,
        borderRadius: 4,
        marginVertical: 5
      },
      name: {
        fontWeight: 'bold',
        marginTop: 5
      },
      title: {
          fontWeight: 'bold',
          fontSize: 16,
          color: 'blue'
      }
});

export default resultsShowScreen;
