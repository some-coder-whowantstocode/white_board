import React from 'react'
import { useNavigate } from 'react-router-dom';

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

const Auth = () => {
    const navigate = useNavigate();
    
    const {AUTHDATA, show} = useauth();

return (
    <Authpage >
        <Auth_logo onClick={()=>navigate(pagelocation.canvas)}>
            <img src={logo} alt="" />
            <span>name</span>
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
