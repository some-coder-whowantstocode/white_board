import React, { useState } from 'react'
import styled from 'styled-components'
import Popups from '../features/popup/components/Popups'
import { history } from '../App'
import { pagelocation } from '../assets/pagesheet'
import { useauth } from '../features/authentication/context/authContext'
import Processings from '../features/processes/components/processings'

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
    
    const [email, setemail] = useState('');
    const {changepass} = useauth(); 

    return (
    <FORGOTPASSPAGE>
        <Processings/>
        <Popups/>
        <REQUESTBOX>
            <h1>Forgot Password</h1>
            <p>Enter the email whose password you forgot</p>
            <input type='email' required value={email} onChange={(e)=>setemail(e.target.value)} />
            <div>
            <button onClick={()=>changepass(email)}>send</button>
            <button onClick={()=>history.navigate(pagelocation.auth)}>go back</button>
            </div>
        </REQUESTBOX>
    </FORGOTPASSPAGE>
    )
}

export default ForgotPassword
