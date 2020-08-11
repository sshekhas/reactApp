import React from 'react';
import './profile.css'
import Avatar from '@material-ui/core/Avatar';
import { FiChevronLeft } from "react-icons/fi"
import { useHistory } from 'react-router-dom';








const Profile = ({Margin,name, location, prefix, postfix, percentage, val, header }) => {
    const history = useHistory();

    const progress = (value) => {
        return <div style={{ height: 25, width: window.innerWidth*0.55, backgroundColor: '#f5f5f5', borderRadius: 40, }}>
          {value?<div  style={{ height: 19, width: window.innerWidth * 0.55 * value, backgroundColor: "#8141E2", borderRadius: 40, borderWidth: 3, borderColor: '#f5f5f5', borderStyle: "solid" }}></div>:null}
        </div>
      }


  return <div className="gradiant" style= {{height:'100%'}}>
{header?<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
<div onClick={()=>history.push('/')}>    
<FiChevronLeft size={30} /> 
</div>
    <img style={{marginRight: 10, marginTop: 3,height: 30, width: 30 ,borderRadius:100}} src="http://127.0.0.1:8887/logo.png"  />
    </div>:<div style={{height:10}}></div>}
<div style={{   display: 'flex',flexDirection: "column", alignItems: 'center',marginTop: Margin}}>
   
<Avatar
style={{height:60, width: 60}}
        alt="GT" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=74daec1914d1d105202bca8a310a6a71" />
      <p style={{marginTop:5,marginBottom:5, fontWeight: "bold"}}>{name}</p>
      <p style={{marginTop:5,marginBottom:15, fontWeight: "bold"}}> {location} </p>
      {progress(val)}

      {val?<p >{prefix} {percentage} {postfix} </p>:null}
    </div>
  </div>
};


export default Profile;
