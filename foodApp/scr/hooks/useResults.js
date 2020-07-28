import { useState, useEffect} from 'react';
import zomato from '../api/zomato';

export default  () => {
  
    const [result, setResult] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const searchApi = async searchKey =>{
        try{const response = await zomato.get('/search',{
            params:{
                entity_id:4,
                entity_type :'city',
                q:searchKey
            }
        });
        // console.log("hi there");
        setResult(response.data.restaurants);
        // console.log(JSON.stringify(result));
        // result.forEach((element) => console.log(element))
    }
        catch(err){
            console.log(err)
            setErrMsg("something went wrong!!")
        }
        
    }
    
    useEffect(() =>{
        console.log("test run");
        searchApi('pasta')
    }, []);

    return [result, searchApi, errMsg];
};