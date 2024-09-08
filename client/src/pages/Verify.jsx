import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { pagelocation } from '../assets/pagesheet';
import { Tests } from '../features/authentication/components/Authblock';
import { history } from '../App';
import { handler } from '../helper';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { popexternalProcess, pushexternalProcess } from '../features/processes/slices/processSlice';
import Popups from '../features/popup/components/Popups';
import Processings from '../features/processes/components/processings';
import { logIn } from '../features/authentication/slices/authSlice';

const VERIFYPAGE = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 
`;

const BOX = styled.div`
 height: max-content;
    width: max-content;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 5rem;
  
  input{
    opacity: 0;
  }
  div{
    display: flex;
    flex-direction: row;
  }
 
`

const OTPBOX = styled.div`
  border: 1px solid gray;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
`;

const OTPBTN = styled.button`
    ${
      props=>`
        background-color: ${props.color};
        color:${props.text};
      `
    }
    
    border: none;
    padding: 8px 14px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: all 0.3s;
    margin: 5px 10px;
    &:hover{
      ${
      props=>`
        background-color: ${props.hover};
      `
    }
    }
`

const Verify = () => {
  const dispatch = useDispatch();
  const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const mustinclude = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const lengthallowed = 6;
  const [otpBoxes, setOtpBoxes] = useState([]);
  const inputref = useRef();
  const [focused,setfocus] = useState(false);

  useEffect(() => {
    const boxes = Array.from({ length: lengthallowed }, (_, index) => (
      <OTPBOX key={index}>{otp.length >= index && otp[index]}{(otp.length !== lengthallowed && index === otp.length && focused) && "|" }</OTPBOX>
    ));
    setOtpBoxes(boxes);
  }, [lengthallowed,otp,focused]);

  useEffect(() => {
    if (email) {
      const emailTests = Tests.email;
      for (let i = 0; i < emailTests.length; i++) {
        if (!emailTests[i].sample.test(email)) {
          history.navigate(pagelocation.invalidparam);
          break;
        }
      }
    } else {
      history.navigate(pagelocation.invalidparam);
    }
  }, [email]);

  const verify = async () => {
    try {
      if(EXTERNAL_PROCESS){
        handler(500, "please wait patiently request is being processed");
        return;
      }
      if(otp.length < lengthallowed){
        handler(500, "please provide the otp given to you.");
        return;
      }
        dispatch(pushexternalProcess({ msg: "verifying user..." }));
        const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_VERIFY}`;
        const body = { email, otp };
        const headers = {};
        let {data} = await axios.post(URL, body, headers);
        const {user} = data;
        dispatch(logIn({name:user.name,email:user.email}));
        history.navigate(pagelocation.auth)
        handler(200,"verified user account.")
    } catch (err) {
      handler(err.status, err?.response?.data?.err || err?.message || "something went wrong.");
    } finally {
      dispatch(popexternalProcess());
    }
  };

  return (
    <VERIFYPAGE>
      <Popups/>
      <Processings/>
      <BOX>
      <h1>OTP verification</h1>
      <p>Enter the OTP you recieved at </p>
      <p>{email}</p>
      <input
        ref={inputref}
        value={otp}
        type='text'
        onBlur={()=>{
          setfocus(false)
        }}
        onChange={(e) => {
          let num = e.target.value;
          if ((mustinclude.includes(num[num.length - 1]) && otp.length < lengthallowed) || e.nativeEvent.inputType === "deleteContentBackward") {
            setOtp(num);
          }
        }}
        required
      />
      <div 
      htmlFor='otp' 
      onClick={()=>{
        inputref.current.focus();
        setfocus(true);
        }}>{otpBoxes}</div>
        <div>
      <OTPBTN color='#00ffbb' hover='#06bf8e' text='#393939' onClick={()=>verify()}>verify</OTPBTN>

        </div>
      </BOX>
    
    </VERIFYPAGE>
  );
};

export default Verify;
