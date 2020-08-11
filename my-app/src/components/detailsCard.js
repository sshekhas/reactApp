import React from 'react';
import { FiChevronRight } from "react-icons/fi"
import { useHistory } from 'react-router-dom';


const DetailsCard = ({  routeName, name, value }) => {
    const history = useHistory();
    const progress = (value) => {
        return <div style={{ height: 15, width: window.innerWidth*0.55, backgroundColor: '#dedcdc', borderRadius: 40 }}>
            {value?<div style={{ height:11, width: window.innerWidth * 0.55 * value, backgroundColor: "#8141E2", borderRadius: 40, borderWidth: 2, borderColor: '#dedcdc',borderStyle: "solid"  }}></div>:null}
        </div>
    }
    

    return <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 10}}onClick={routeName?()=>history.push('/personalDetails'):null}>
    <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: '5%',
        marginRight: '5%'
    }}>
    <p style={{
        fontSize: 16,
        fontWeight: "bold"
    }}>{name}</p>
    <FiChevronRight size={16} color='black' style={{marginTop: 16, marginRight: 5}} /> 
    </div>
    <div style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginLeft: '5%',
        marginRight: '5%'
    }}> 
    {progress(value)}
    
    </div>
    </div>



};



export default DetailsCard;