import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import Icons from './Icons';
import { Icon } from '../styles/icon';
import { IconBox } from '../../../assets/icons';
import Colourpicker from './Colourpicker';

const ParentIcon = styled.div`
  position: relative;
  display: flex;
  ${(props) =>
    props.vis === "true" && `box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75)`};
  cursor: pointer;
`;


const AllShapes = styled.div`
  width: fit-content;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);
  opacity: 0;
  transition: top 0.3s, opacity 0.4s;
  position: absolute;
  left: 0px;
  top: -150px;
  ${(props) => props.vis === "true" && `
  opacity:1;
  display:flex;
  flex-direction: column;
  top: 30px;
  `}
  background-color:white;
`;

const DropIcon = ({icon,childicons,selected, name}) => {

  const [shape, show_shape] = useState(false);
  const element = useRef(null);

  return (
    <>
        <ParentIcon 
        ref={element}
        
        >
          
          <Icon
          sel={String(selected)}
          onClick={(e)=>{
            show_shape(!shape)
          }}
          >
          {
            React.createElement(icon,
              {}
            )
          }
          </Icon>
          
          <AllShapes
        vis={String(shape)}
        >
          {
            name === IconBox.DRAW.name &&
            <Colourpicker/>
          }
          <Icons icons={childicons}/>
      </AllShapes>
        </ParentIcon>
    </>
  )
}

export default DropIcon
