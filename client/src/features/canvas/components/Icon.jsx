import React from 'react'

import { Icon } from '../styles/icon'
import { IconBox } from '../../../assets/icons'
import { useSelector } from 'react-redux'

const SingleIcon = (icondata) => {
  const AUTHSTATUS = useSelector(state=>state.auth.authstatus);
  console.log(AUTHSTATUS)
  return (
     <Icon  onMouseDown={(e)=>e.stopPropagation()} sel={String(icondata.selected)} >
       <>
       {/* <p>{icondata.name}</p> */}
       {
        icondata.name === IconBox.USER.name && AUTHSTATUS === true ?
        // console.log(icondata.img)
        <p>{localStorage.getItem('auth').slice(0,1).toUpperCase()}</p>
        :
        React.createElement(icondata.icon,{})
       }
       </>
    </Icon>
  )
}

export default SingleIcon
