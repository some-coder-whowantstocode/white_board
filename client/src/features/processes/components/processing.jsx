import React from 'react'
import { Loading, PROCESS } from '../styles/Processes'

const Processing = ({info}) => {
return (
    <PROCESS>
    <p>{info}</p> 
    <Loading/>
    </PROCESS>
)
}

export default Processing
