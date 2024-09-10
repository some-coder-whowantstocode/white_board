import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components';
import Popup from './Popup';

const POPUPBOX = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    z-index: 10000;
`

const Popups = () => {
    const POPUPS = useSelector(state=>state.popup.popups);
    useEffect(()=>{
        console.log(POPUPS)
    },[POPUPS])
    return (
    <POPUPBOX>
        {
            Object.keys(POPUPS).map((key)=>(
                <Popup key={key} dataId={key} data={POPUPS[key]} />
            ))
        }
    </POPUPBOX>
    )
}

export default Popups
