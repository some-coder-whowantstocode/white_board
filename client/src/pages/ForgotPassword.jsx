import React, { useState } from 'react'
import styled from 'styled-components'
import { handler } from '../helper'
import axios from 'axios'
import { Tests } from '../features/authentication/components/Authblock'
import { useDispatch, useSelector } from 'react-redux'
import { popexternalProcess, pushexternalProcess } from '../features/processes/slices/processSlice'
import Processings from '../features/processes/components/processings'
import Popups from '../features/popup/components/Popups'
import { history } from '../App'
import { pagelocation } from '../assets/pagesheet'

export const FORGOTPASSPAGE = styled.div`
    height: 100vh;
    width:100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`
export const REQUESTBOX = styled.div`
    background-color: white;
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    h1{
        margin: 5px 0px;
    }
    p{
        margin: 15px 0px;
    }
    input{
        margin-bottom: 15px;
        width: 250px;
        height: 30px;
        font-size: 19px;
        outline: none;
        border: 2px solid black;
    }
    button{
        border: none;
        padding: .5rem .7rem;
        margin: 0px 1rem;
        background-color: #00b3ff;
        color: white;
        cursor: pointer;
        &:hover{
            background-color: #01648e;
        }
    }
`

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);
    
    const [email, setemail] = useState('');

    const changepass = async()=>{
        try{
            if(EXTERNAL_PROCESS) return;
            if(!email){
                handler(500,"please enter email.");
                return;
            }
            const emailTests = Tests.email;
            for (let i = 0; i < emailTests.length; i++) {
                if (!emailTests[i].sample.test(email)) {
                    handler(500,"please enter a valid email.");
                break;
                }
            }
            
            dispatch(pushexternalProcess({msg:"singing in..."}))
            const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_FORGOT_PASS}`;
            const body = {
                email
            };
            const headers = {}
            const {data} = await axios.post(URL, body, headers)
            handler(200,'Email has been sent to the given email please check your email to changepass.')
            history.navigate(pagelocation.canvas)
        }catch(err){
            handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
        }finally{
            dispatch(popexternalProcess())
        }
    }

    return (
    <FORGOTPASSPAGE>
        <Processings/>
        <Popups/>
        <REQUESTBOX>
            <h1>Forgot Password</h1>
            <p>Enter the email whose password you forgot</p>
            <input type='email' required value={email} onChange={(e)=>setemail(e.target.value)} />
            <div>
            <button onClick={()=>changepass()}>send</button>
            <button onClick={()=>history.navigate(pagelocation.auth)}>go back</button>
            </div>
        </REQUESTBOX>
    </FORGOTPASSPAGE>
    )
}

export default ForgotPassword
