import React from 'react'
import { ERRORPAGE } from '../../features/errorpages/styles/errorpages'
import { history } from '../../App'
import { pagelocation } from '../../assets/pagesheet'

const InvalidParameter = () => {
  return (
    <ERRORPAGE>
    <text>Invalid Parameter</text>
    <div>The URL parameter provided is invalid or tampered with. Please check the URL and try again.</div>
    <button onClick={()=>history.navigate(pagelocation.canvas)}>Go back ⇾</button>
  </ERRORPAGE>
  
  )
}

export default InvalidParameter
