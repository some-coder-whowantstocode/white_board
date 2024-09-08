import React from 'react'
import { history } from '../../App'
import { pagelocation } from '../../assets/pagesheet'
import { ERRORPAGE } from '../../features/errorpages/styles/errorpages'



const NotFound = () => {
  return (
    <ERRORPAGE>
      <p>404</p>
      <div>Oops! page does not exist.</div>
      <button onClick={()=>history.navigate(pagelocation.canvas)}>Go to main page ⇾</button>
    </ERRORPAGE>
  )
}

export default NotFound
