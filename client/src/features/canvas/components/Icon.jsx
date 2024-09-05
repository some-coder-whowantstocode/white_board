import React, { useEffect, useState } from 'react'

import { Icon } from '../styles/icon'
import { IconBox } from '../../../assets/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getuserData, isloggedin } from '../../authentication/slices/authSlice'
// import { isloggedin, getuserData } from '../../authentication/slices/authSlice'


const SingleIcon = (icondata) => {

  const AUTH = useSelector(state=>state.auth)
  const AUTHSTATUS = useSelector(state=>state.auth.authstatus);
  const dispatch = useDispatch();
  const [username,setusername] = useState("");


  useEffect(()=>{
    dispatch(isloggedin());
    if(icondata.name === IconBox.USER.name && AUTHSTATUS === true){
      const data = sessionStorage.getItem(AUTH.name);
      const {name} = JSON.parse(data);
      setusername(name);
    }
  },[AUTHSTATUS])
  
  return (
     <Icon  onMouseDown={(e)=>e.stopPropagation()} sel={String(icondata.selected)} >
       <>
       {
        icondata.name === IconBox.USER.name && AUTHSTATUS === true ?
        <p>{username.slice(0,1).toUpperCase()}</p>
        :
        React.createElement(icondata.icon,{})
       }
       </>
    </Icon>
  )
}

export default SingleIcon
