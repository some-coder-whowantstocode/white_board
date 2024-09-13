import React, { useState } from 'react'
import Processings from '../features/processes/components/processings'
import Popups from '../features/popup/components/Popups'
import { FORGOTPASSPAGE, REQUESTBOX } from './ForgotPassword'
import { useParams } from 'react-router-dom'
import { useauth } from '../features/authentication/context/authContext'


const Resetpasssword = () => {
    
    const {resetpass} = useauth();

    const {token} = useParams();
    const [password, setpassword] = useState('');

   

    return (
    <FORGOTPASSPAGE>
        <Processings/>
        <Popups/>
        <REQUESTBOX>
            <h1>Reset Password</h1>
            <p>Please enter the new password</p>
            <input type='text' required value={password} onChange={(e)=>setpassword(e.target.value)} />
            <div>
            <button onClick={()=>resetpass(password,token)}>update</button>
            </div>
        </REQUESTBOX>
    </FORGOTPASSPAGE>
    )
}

export default Resetpasssword
