import React, { useEffect, useState } from 'react'

import Icon from './Icon'
import DropIcon from './DropIcon';
import { useCanvas } from '../context/canvasProvider';
import { useSelector } from 'react-redux';

const Icons = ({icons}) => {

  const SELECTED = useSelector((state)=>state.canvas.currentmode)
 
  return (
    <>
    {icons.map(({ icon, func ,mode , parentIcon, innericons,type }, i) => (
      <div 
      key={i} 
      onClick={(e) => {

        func && func();
      }} 
      >
        {
          parentIcon ? 
          <DropIcon 
          name={type}
          icon={icon}
          childicons={innericons}
          selected={mode==SELECTED}
          />
          :
          <Icon
          name={type}
          selected={mode==SELECTED}
          icon={icon}
          
          />
        }
      </div>
    ))}
    </>

  
  )
}

export default Icons
