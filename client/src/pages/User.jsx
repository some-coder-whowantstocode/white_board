import React, { useEffect, useRef, useState } from 'react'

import { USER_DETAILS, USER_PAGE, LEFT, RIGHT, User_btn, HIDDEN_PAGE, CONTENT } from '../features/user/styles/user'
import { pagelocation } from '../assets/pagesheet'
import { Auth_logo } from '../features/authentication/styles/auth'
import logo from '../assets/white board logo.png'
import Popups from '../features/popup/components/Popups'
import { addpopup } from '../features/popup/slices/popupSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { isloggedin, logOut, getuserData } from '../features/authentication/slices/authSlice'
import { handler } from '../helper/handler'
import { history } from '../App'
import { popexternalProcess, pushexternalProcess } from '../features/processes/slices/processSlice'



const User = () => {

  const [userName, setuserName] = useState('');
  const [useremail, setuseremail] = useState('')
  const [password, setpassword] = useState('')
  const [original, changeoriginal] = useState({name:'',email:"",password:""});
  const [updateneeded, setupdateneed] = useState(false);
  const [show,setshow] = useState(false);
  const [confirm,setconfirm] = useState("");
  const AUTH = useSelector(state=>state.auth);
  const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);


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
      if(EXTERNAL_PROCESS) return;
      dispatch(pushexternalProcess('updating user....'));
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
      handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")    
    }finally{
      dispatch(popexternalProcess());
    }
  }

  const deleteuser = async()=>{
    try {
      if(EXTERNAL_PROCESS) return;
      dispatch(pushexternalProcess('updating user....'));
      const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_DELETE}`;
      const headers = {}
      const body = {
        pass:confirm
      };
      const {data} = await axios.post(URL,body,{
          headers: headers,
          withCredentials: true 
      });
      handler(200, "user deleted");
      history.navigate(pagelocation.auth);
      dispatch(logOut());
    } catch (err) {
      handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
    }finally{
      dispatch(popexternalProcess());
    }

    console.log('deleteeeeeeeeeeeeeee')
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
        <div>
      <User_btn 
      disabled={updateneeded} 
      col={updateneeded} 
      onClick={()=>update()}>
        update
      </User_btn>
      
      <User_btn 
      backcol={'#a71000'}
      hovbackcol={'#892319'}
      onClick={()=>{
        dispatch(logOut());
        history.navigate(pagelocation.auth)
        }}>
          Log out
      </User_btn>

      <User_btn 
        backcol={'#a71000'}
        hovbackcol={'#892319'}
      onClick={()=>setshow(true)}>
        delete user
      </User_btn>

        </div>

        {
          show &&
        <HIDDEN_PAGE>
          <CONTENT>
            <p>Do you really want to <p>Permanently  Delete</p>  this account?</p>
            <input type="password" value={confirm} onChange={(e)=>setconfirm(e.target.value)} />
            <div>
            <User_btn 
              backcol={'#a71000'}
              hovbackcol={'#892319'}
              onClick={()=>deleteuser()}>
              confirm
            </User_btn>
            <User_btn 
              onClick={()=>{
                setshow(false);
                setconfirm("");
                }}>
              cancel
            </User_btn>
            </div>
          </CONTENT>
        </HIDDEN_PAGE>
        }
        
    </USER_PAGE>
  )
}

export default User
