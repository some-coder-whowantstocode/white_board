import React from 'react'

import { Icon } from '../styles/icon'

const SingleIcon = ({selected, icon,name}) => {
  return (
     <Icon  onMouseDown={(e)=>e.stopPropagation()} sel={String(selected)} >
       <>
       <p>{name}</p>
        {React.createElement(icon,{})}
       </>
    </Icon>
  )
}

export default SingleIcon
