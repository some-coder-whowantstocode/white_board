import React, { useState } from 'react'
import { handler } from '../helper'
import axios from 'axios'
import { Tests } from '../features/authentication/components/Authblock'
import { useDispatch, useSelector } from 'react-redux'
import { popexternalProcess, pushexternalProcess } from '../features/processes/slices/processSlice'
import Processings from '../features/processes/components/processings'
import Popups from '../features/popup/components/Popups'
import { history } from '../App'
import { pagelocation } from '../assets/pagesheet'
import { FORGOTPASSPAGE, REQUESTBOX } from './ForgotPassword'
import { useParams } from 'react-router-dom'


const Resetpasssword = () => {

    const dispatch = useDispatch();
    const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);
    
    const {token} = useParams();
    const [password, setpassword] = useState('');

    const changepass = async()=>{
        try{
            if(EXTERNAL_PROCESS) return;
            if(!password){
                handler(500,"please enter password.");
                return;
            }
            const passwordTests = Tests.password;
            for (let i = 0; i < passwordTests.length; i++) {
                if (!passwordTests[i].sample.test(password)) {
                    handler(500,"please enter a valid password.");
                break;
                }
            }
            
            dispatch(pushexternalProcess({msg:"singing in..."}))
            const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_CHANGE_PASS}/${token}`;
            const body = {
                password
            };
            const headers = {}
            const {data} = await axios.post(URL, body, headers)
            handler(200,'password changed successfully')
            history.navigate(pagelocation.auth);
        }catch(err){
            console.log(err)
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
            <h1>Reset Password</h1>
            <p>Please enter the new password</p>
            <input type='text' required value={password} onChange={(e)=>setpassword(e.target.value)} />
            <div>
            <button onClick={()=>changepass()}>update</button>
            </div>
        </REQUESTBOX>
    </FORGOTPASSPAGE>
    )
}

export default Resetpasssword
