import React, { useEffect, useState } from 'react'

import Icon from './Icon'
import DropIcon from './DropIcon';
import { useCanvas } from '../context/canvasProvider';
import { useSelector } from 'react-redux';

const Icons = ({icons}) => {

  const SELECTED = useSelector((state)=>state.canvas.currentmode)
 
  return (
    <>
    {icons.map(({ icon,des, func ,mode, shape , parentIcon, innericons,type }, i) => (
      <div 
      key={i} 
      onClick={(e) => {

        func && func();
      }} 
      >
        {
          parentIcon ? 
          <DropIcon 
          icon={icon}
          childicons={innericons}
          name={type}
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
