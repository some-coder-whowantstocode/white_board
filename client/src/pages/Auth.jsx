import React, { useEffect } from 'react'

import { 
    Authpage, 
    Authbox, 
    Styledbackground,
    Auth_logo
    } from '../features/authentication/styles/auth'
import Authblock from '../features/authentication/components/Authblock';
import { useauth } from '../features/authentication/context/authContext';
import logo from '../assets/white board logo.png'
import { pagelocation } from '../assets/pagesheet';
import Popups from '../features/popup/components/Popups';
import { history } from '../App';
import Processings from '../features/processes/components/processings';
import { useDispatch, useSelector } from 'react-redux';
import { isloggedin } from '../features/authentication/slices/authSlice';

const Auth = () => {
    
    const {AUTHDATA, show} = useauth();
  const AUTH = useSelector(state=>state.auth.authstatus);
  const dispatch = useDispatch();
  

    useEffect(()=>{
        dispatch(isloggedin())
        if(AUTH){
          history.navigate(pagelocation.user);
        }
      },[AUTH])

return (
    <Authpage >
        <Popups/>
        <Processings/>
        <Auth_logo onClick={()=>history.navigate(pagelocation.canvas)}>
            <img src={logo} alt="" />
            <span>whiteboard</span>
        </Auth_logo>
        <Authbox>
        <Styledbackground show={show} ></Styledbackground>

            {
                
                AUTHDATA.map((item,i)=>(
                    <Authblock key={`${item+i}`} item={item} />
                ))
            }
        </Authbox>
    </Authpage>
)
}

export default Auth
