import React, { useContext } from 'react';

import UseWindowDimensions from '../hooks/useWindowDimensions'
import Profile from '../components/profile';
import { Context as DetailsContext } from '../context/DetailsContext';
import DetailsCard from '../components/detailsCard';
const StatusScreen = () => {
    
    const { height, width } = UseWindowDimensions();
    const {  state } = useContext(DetailsContext);
    const value = (state.personal + state.investment + state.lifestyle + state.expenses)/4;
    const per = `${Math.round(value*100)}%`
    return (
        <div style={{ flex: 1, height: height *1.2, position: "relative", top: 0, backgroundColor: '#dedcdc' }}>
            <div style={{ position: 'relative', height: height*0.6 }}>

                <Profile
                    name={'User name'}
                    location={'Bangalore, India'}
                    prefix={'You completed'}
                    postfix=''
                    percentage={per}
                    val={value}
                    header=''
                    Margin={40} />
            </div>

            <div className='formContainer' style={{ width: width * 0.60, marginLeft: width * 0.19, marginRight: width * 0.20 }}>
            <DetailsCard
            routeName = "PersonalDetails"
             name = "Personal Details"
            value = {state.personal}
            
            />
            <DetailsCard
             name = "Investment Details"
            value = {state.investment}
            
            />
            <DetailsCard
             name = "Expenses Details"
            value = {state.expenses}
            
            />
            <DetailsCard
             name = "Lifestyle Details"
            value = {state.lifestyle}
            
            />
                  
            </div>

        </div>
    );
};


export default StatusScreen;
