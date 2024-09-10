import React, { useEffect, useRef, useState } from 'react'

import {
    Authbox_part, Auth_icons, Auth_instructions, Auth_input, Auth_btn, Rememberme,
    HIDDEN_AUTH_PART
} from '../styles/auth.js'
import { useauth } from '../context/authContext.jsx'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { change_token_memory, logIn } from '../slices/authSlice.js';
import { pagelocation } from '../../../assets/pagesheet.js';
import { history } from  '../../../App.jsx';
import { handler } from '../../../helper.js';
import { popexternalProcess, pushexternalProcess } from '../../processes/slices/processSlice.js';


export const Tests = {
    password:[
    {sample: /^(?=.*[a-z]).*$/, err: "The password must contain at least one small letter."},
    {sample: /^(?=.*[A-Z]).*$/, err: "The password must contain at least one capital letter."},
    {sample: /^(?=.*[0-9]).*$/, err: "The password must contain at least one number."},
    {sample: /^(?=.*[!@#$%^&*]).*$/, err: "The password must contain at least one symbol."},
    {sample: /^.{6,12}$/, err: "The password length must be between 6 to 12 characters."}
],
email:[
    {sample: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, err:"Please provide a valid email."}
],
name:[
    {sample: /^.{4,14}$/, err: "The name length must be between 6 to 12 characters."}
]
}

const Authblock = ({item}) => {
    const AUTH = useSelector(state=>state.auth)
    const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);
    const {show, setshow} = useauth();
    const inputdata = useRef({
        signin:{email:'', password:''},
        signup:{name:'', email:'', password:''}}
    );

   

    const dispatch = useDispatch();

    useEffect(()=>{
        inputdata.current = {
            signin:{email:'', password:''},
            signup:{name:'', email:'', password:''}}
    },[show]);
    

    const verify =async()=>{
        try{
            const allTests = Object.keys(inputdata.current[show]);
            for( let i=0; i<allTests.length; i++ ){
                const tests = Tests[allTests[i]];
                for(let j=0;j<tests.length;j++){
                    console.log(tests[j])
                    if(!tests[j].sample.test(inputdata.current[show][allTests[i]])){
                        handler(500,tests[j].err);
                        return false;
                    }
                }
            }
            return true;
        }catch(err){
            console.log(err);
        }
        
    }

    const signIn =async()=>{
        let verified =await verify();
        if(verified && !EXTERNAL_PROCESS){
            try{
                dispatch(pushexternalProcess({msg:"singing in..."}))
                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_LOGIN}`;
                const headers = {}
                const body = {...inputdata.current[show],persist:AUTH.rememberme}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                const {user} = data;

                if(!user.verified){
                    history.navigate(pagelocation.notverified);
                }
                    dispatch(logIn({name:user.name,email:user.email}));
                    history.navigate(pagelocation.user)
                    handler(200,"successfully loggedin.")
            
            }catch(err){
                console.log(err?.response?.data?.err)
                handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
            }finally{
                dispatch(popexternalProcess())
            }
        }
    }

    const signUp =async()=>{
        let verified =await verify();
        if(verified && !EXTERNAL_PROCESS){
            try{
                dispatch(pushexternalProcess({msg:"signing up..."}))

                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_REGISTER}`;
                const headers = {}
                const body = {...inputdata.current[show]}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                handler(200,"successfully signed up.")
                    history.navigate(pagelocation.notverified);
            }catch(err){
                handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")

            }finally{
                dispatch(popexternalProcess())
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
