import React, { useEffect } from 'react'

import {
    Authbox_part, Auth_icons, Auth_instructions, Auth_input, Auth_btn, Rememberme,
    HIDDEN_AUTH_PART
} from '../styles/auth.js'
import { useauth } from '../context/authContext.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { change_token_memory, logIn } from '../slices/authSlice.js';
import { pagelocation } from '../../../assets/pagesheet.js';
import { history } from  '../../../App.jsx';



const Authblock = ({item}) => {
    const AUTH = useSelector(state=>state.auth)
    const {signIn, signUp, inputdata} = useauth();
    const {show, setshow} = useauth();

    const dispatch = useDispatch();

    useEffect(()=>{
        inputdata.current = {
            signin:{email:'', password:''},
            signup:{name:'', email:'', password:''}}
    },[show]);

    
return (
    <>
        {
                
                    <Authbox_part show={`${show === item.name}`}>
                        {
                            show=== item.name ? 
                        <>
                            <p>{item.head}</p>
                        <Auth_icons id={item.name}>
                        {
                            item.otherways.map((logo,i)=>(
                                <span key={i}>{logo}</span>
                            ))
                        }
                        </Auth_icons>
                        
                        <Auth_instructions show={`${show === item.name}`}>{item.instruction}</Auth_instructions>
                        {
                            item.inputs.map((i,key)=>(
                                <Auth_input 
                                type={i}
                                required
                                key={key}
                                onChange={(e)=>{
                                    inputdata.current[item.name][i] = e.target.value;
                                }}
                                placeholder={i}/>
                            ))
                        }
                        <Rememberme>
                        <input type='checkbox' onClick={()=>dispatch(change_token_memory())}/>
                        <p>remember me</p>
                        </Rememberme>
                        <Auth_btn 
                        onClick={()=>{
                            if(show === 'signup'){
                                signUp();
                            }else{
                                signIn();
                            }
                        }}
                        >{item.btntext}
                        </Auth_btn>
                    <a  onClick={()=>history.navigate(pagelocation.forgotpass)} >forgot password</a>
                        </>
                            :
                            <HIDDEN_AUTH_PART>
                                <p>{item.alternative.head}</p>
                                <Auth_instructions>{item.alternative.instruction}</Auth_instructions>
                                <Auth_btn onClick={()=>show != item.name && setshow(item.name)}>{item.btntext}</Auth_btn>
                            </HIDDEN_AUTH_PART>
                        }
                    </Authbox_part>
            }  
    </>
)
}

export default Authblock
