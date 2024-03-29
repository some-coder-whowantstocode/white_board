import React, { useState } from 'react'

import Icon from './Icon'
import DropIcon from './DropIcon';
import { useCanvas } from '../context/canvasProvider';

const Icons = ({icons}) => {

  const { currentMode} = useCanvas();

  return (
    <>
    {icons.map(({ icon,des, func ,mode, shape , parentIcon, innericons }, i) => (
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
          name={des}
          />
          :
          <Icon
          name={des}
          selected={mode===currentMode.mode && shape === currentMode.shape}
          icon={icon}
          
          />
        }
      </div>
    ))}
    </>

  
  )
}

export default Icons
