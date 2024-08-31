import React, { useEffect, useRef, useState } from 'react'

import { USER_DETAILS, USER_PAGE, LEFT, RIGHT, User_btn } from '../features/user/styles/user'
import { pagelocation } from '../assets/pagesheet'
import { useNavigate } from 'react-router-dom'
import { Auth_logo } from '../features/authentication/styles/auth'
import logo from '../assets/white board logo.png'
import Popups from '../features/popup/components/Popups'
import { addpopup } from '../features/popup/slices/popupSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { logOut } from '../features/authentication/slices/authSlice'



const User = () => {

  const navigate = useNavigate();
  const [userName, setuserName] = useState('random');
  const [useremail, setuseremail] = useState('random@gmail.com')
  const [password, setpassword] = useState('')
  const [original, changeoriginal] = useState({name:'random',email:"random@gmail.com",password:""});
  const [updateneeded, setupdateneed] = useState(false);

  const dispatch = useDispatch();

  useEffect(()=>{
    if(userName === original.name && useremail === original.email && password === original.password){
      setupdateneed(true);
    }else{
      setupdateneed(false);
    }
  },[userName, useremail, password, original])

  useEffect(()=>{
    
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
      dispatch(addpopup({msg: "user updated.", type:0}));
    } catch (error) {
      console.log(error)
      switch(error.status){
        case 401 :
          dispatch(addpopup({msg: "Token expired.", type:1}));
          dispatch(logOut())
          navigate(pagelocation.auth)
        break;

        default:
          dispatch(addpopup({msg: "something went wrong.", type:1}));
        break;
      }
    }
  }

  return (
    <USER_PAGE>
      <Popups/>
      <Auth_logo onClick={()=>navigate(pagelocation.canvas)}>
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
