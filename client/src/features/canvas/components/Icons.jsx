import React, { useEffect, useState } from 'react'

import Icon from './Icon'
import DropIcon from './DropIcon';
import { useCanvas } from '../context/canvasProvider';
import { useSelector } from 'react-redux';

const Icons = ({icons}) => {

  const SELECTED = useSelector((state)=>state.canvas.currentmode)
 
  return (
    <>
    {icons.map(({ icon,des, func ,mode, shape , parentIcon, innericons }, i) => (
      <div 
      key={i} 
      onClick={(e) => {

        console.log(mode,SELECTED)
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
