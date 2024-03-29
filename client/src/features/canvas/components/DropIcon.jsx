import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import Icons from './Icons';

const ParentIcon = styled.div`
  border-radius: 4px;
  padding: 5px;
  position: relative;
  display: flex;
  ${(props) =>
    props.vis === "true" && `box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75)`};
  cursor: pointer;
  &:hover{
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75);
    }
`;


const AllShapes = styled.div`
  width: fit-content;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);
  opacity: 0;
  transition: top 0.3s, opacity 0.4s;
  position: absolute;
  left: 0px;
  top: -100px;
  ${(props) => props.vis === "true" && `
  opacity:1;
  display:flex;
  flex-direction: column;
  top: 30px;
  `}
  background-color:white;
`;

const DropIcon = ({icon,childicons,name}) => {


  const [shape, show_shape] = useState(false);
  const element = useRef(null);

  useEffect(()=>{

    const handleclick =(e)=>{
      if(e.target === element.current || element.current.contains(e.target)){
        !shape && show_shape(true)
      }else{
        shape && show_shape(false);
       
      }
    }

    document.addEventListener('click',handleclick);

    return ()=>{
      document.removeEventListener('click',handleclick);
    }
  },[shape])

  return (
    <>
        <ParentIcon 
        ref={element}
        >
          
          <p>{name}</p>
          {
            React.createElement(icon,{})
          }
          
          <AllShapes
        vis={String(shape)}
        
        >
          <Icons icons={childicons}/>
      </AllShapes>
        </ParentIcon>
    </>
  )
}

export default DropIcon
