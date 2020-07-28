import axios from 'axios';

export default axios.create({
    baseURL: 'https://developers.zomato.com/api/v2.1',
    headers: {
        'user-key': 'ad07f1a35585e2f00bd7088b8758f016'
    }
});