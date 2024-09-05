import React, { useEffect, useRef, useState } from 'react'

import { USER_DETAILS, USER_PAGE, LEFT, RIGHT, User_btn } from '../features/user/styles/user'
import { pagelocation } from '../assets/pagesheet'
import { Auth_logo } from '../features/authentication/styles/auth'
import logo from '../assets/white board logo.png'
import Popups from '../features/popup/components/Popups'
import { addpopup } from '../features/popup/slices/popupSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { isloggedin, logOut, getuserData } from '../features/authentication/slices/authSlice'
import { handler } from '../helper'
import { history } from '../App'



const User = () => {

  const [userName, setuserName] = useState('');
  const [useremail, setuseremail] = useState('')
  const [password, setpassword] = useState('')
  const [original, changeoriginal] = useState({name:'',email:"",password:""});
  const [updateneeded, setupdateneed] = useState(false);
  const AUTH = useSelector(state=>state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    if(userName === original.name && useremail === original.email && password === original.password){
      setupdateneed(true);
    }else{
      setupdateneed(false);
    }
  },[userName, useremail, password, original])

  useEffect(()=>{
    if(!dispatch(isloggedin())){
      history.navigate(pagelocation.auth);
    }else{
      (async()=>{
        const data= sessionStorage.getItem(AUTH.name);
        if(!data){
          handler(401);
          return;
        }
        const {name, email} = JSON.parse(data);
        if(!name || !email){
          handler(401);
          return;
        }
        setuserName(name);
        setuseremail(email);
        changeoriginal({name,email,password:""})
      })()
     
    }
    
    
  },[])

  const update =async()=>{
    try {
      const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_UPDATE}`;
      const headers = {}
      const body = {
        name:userName,
        email:useremail,
        password
      }
      const {data} = await axios.post(URL,body,{
          headers: headers,
          withCredentials: true 
      });
      setuseremail(data.email);
      setpassword("");
      setuserName(data.name);
      changeoriginal({
        name:data.name,
        password:"",
        email:data.email
      })
      handler(200, "user updated")
    } catch (error) {
      console.log(error)
      handler(error.status)      
    }
  }

  return (
    <USER_PAGE>
      <Popups/>
      <Auth_logo onClick={()=>history.navigate(pagelocation.canvas)}>
            <img src={logo} alt="" />
            <span>name</span>
        </Auth_logo>
        <USER_DETAILS>
          <LEFT>
          {
            original.name.slice(0,1).toUpperCase()
          }
          </LEFT>
          <RIGHT>
            <p>user name</p>
            <input type="text" placeholder='john doe' value={userName} onChange={(e)=>setuserName(e.target.value)} />
            <p>email</p>
            <input type="email" placeholder='example@gmail.com' value={useremail} onChange={(e)=>setuseremail(e.target.value)} />
            <p>password</p>
            <input type="password" placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} />
          </RIGHT>
          
        </USER_DETAILS>
      <User_btn disabled={updateneeded} col={updateneeded} onClick={()=>update()}>update</User_btn>
    </USER_PAGE>
  )
}

export default User
