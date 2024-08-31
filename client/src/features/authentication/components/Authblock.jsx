import React, { useEffect, useRef, useState } from 'react'

import {
    Authbox_part, Auth_icons, Auth_instructions, Auth_input, Auth_btn, Rememberme
} from '../styles/auth.js'
import { useauth } from '../context/authContext.jsx'
import { addpopup } from '../../popup/slices/popupSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { change_token_memory, logIn } from '../slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { pagelocation } from '../../../assets/pagesheet.js';

const Authblock = ({item}) => {
    const AUTH = useSelector(state=>state.auth)
    const {show, setshow} = useauth();
    const inputdata = useRef({
        signin:{email:'', password:''},
        signup:{name:'', email:'', password:''}}
    );

    const Tests = {
        password:[
        // {sample: /^(?=.*[a-z]).*$/, err: "The password must contain at least one small letter."},
        // {sample: /^(?=.*[A-Z]).*$/, err: "The password must contain at least one capital letter."},
        // {sample: /^(?=.*[0-9]).*$/, err: "The password must contain at least one number."},
        // {sample: /^(?=.*[!@#$%^&*]).*$/, err: "The password must contain at least one symbol."},
        // {sample: /^.{6,12}$/, err: "The password length must be between 6 to 12 characters."}
    ],
    email:[
        {sample: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, err:"Please provide a valid email."}
    ],
    name:[
        {sample: /^.{6,14}$/, err: "The password length must be between 6 to 12 characters."}
    ]
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const verify =()=>{
        // dispatch(storetoken('token'))
        let allgood = true;
        Object.keys(inputdata.current[show]).map((i)=>{
            let val = inputdata.current[show][i];
            for(let j=0; j<Tests[i].length; j++){
                const {sample, err} = Tests[i][j];
                if(!sample.test(val)){
                    dispatch(addpopup({msg:err, type:1}));
                    allgood = false;
                    break;
                }
            }
        })

        return allgood;
    }

    const signIn =async()=>{
        if(verify()){
            try{
                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_LOGIN}`;
                const headers = {}
                const body = {...inputdata.current[show],persist:AUTH.rememberme}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                dispatch(logIn(data.user));
                dispatch(addpopup({msg:"successfully loggedin.", type:0}));
                navigate(pagelocation.canvas)
            }catch(err){
                console.log(err)
                dispatch(addpopup({msg: "something went wrong.", type:1}));
            }
        }
    }

    const signUp =async()=>{
        if(verify()){
            try{
                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_REGISTER}`;
                const headers = {}
                const body = {...inputdata.current[show]}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                dispatch(logIn(data.user));
                dispatch(addpopup({msg:"successfully loggedin.", type:0}));
                navigate(pagelocation.canvas)
            }catch(err){
                dispatch(addpopup({msg:err.response.data.err || err.message || "something went wrong.", type:1}));
            }
        }
    }

    
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
                            item.otherways.map((logo)=>(
                                <span>{logo}</span>
                            ))
                        }
                        </Auth_icons>
                        
                        <Auth_instructions show={`${show === item.name}`}>{item.instruction}</Auth_instructions>
                        {
                            item.inputs.map((i)=>(
                                <Auth_input 
                                type={i}
                                required
                                onChange={(e)=>{
                                    inputdata.current[item.name][i] = e.target.value;
                                }}
                                placeholder={i}/>
                            ))
                        }
                        <Rememberme>
                        <input type='checkbox' checked={AUTH.rememberme} onClick={()=>dispatch(change_token_memory())}/>
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
                        </>
                            :
                            <>
                                <p>{item.alternative.head}</p>
                                <Auth_instructions>{item.alternative.instruction}</Auth_instructions>
                                <Auth_btn onClick={()=>show != item.name && setshow(item.name)}>{item.btntext}</Auth_btn>
                            </>
                        }
                    
                    </Authbox_part>
            }  
    </>
)
}

export default Authblock
