import React, { useState } from "react";
import { styled } from "styled-components";

import { useCanvas } from "../context/canvasProvider";
import Icons from "./Icons";
import { useIcons } from "../context/iconContext";

const ControlBox = styled.span`
  position: absolute;
  left:50%;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  width: fit-content;
`;

const Panel = styled.div`
  width: 60vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: fit-content;
  border-radius: 2px 2px 10px 10px;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);
`;

const Shapedoor = styled.div`
  border-radius: 4px;
  padding: 5px;
  ${(props) =>
    props.vis === "true" && `box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75)`};
`;

const AllShapes = styled.div`
  width: 50vw;
  border-radius: 2px 2px 10px 10px;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);
  display: none;
  transition: 0.3s all;
  ${(props) => props.vis === "true" && `display:flex;`}
`;

const Controller = () => {
  const { controlIcons, controlIcon_shapes } = useCanvas();
  const { IconBox } = useIcons();

  const [shape, show_shape] = useState(false);
  const [selectedicon, selecticon] = useState(IconBox.DRAW.name);
  const [selectedshape,changeselection] = useState(false);

  const changeshape =(type,selectable)=> {
    if(selectable && shape !== type){
      selecticon(type) 
    }
  }

  return (
    <ControlBox>
      <Panel onMouseLeave={() => {if( !selectedshape) show_shape(false)}}>
        <Shapedoor vis={String(shape)}>
          {
            <IconBox.SHAPES.icon 
            onMouseEnter={()=>show_shape(true)}
            />
          }
        </Shapedoor>

        {controlIcons.map(({ icon, func,type,selectable }, i) => (
          <div 
          key={i} 
          onMouseEnter={() => {if(shape === true && !selectedshape ) show_shape(false)}}
          onClick={() => {
            if(selectedshape && selectable){
              changeselection(false);
              
            } 
            if (selectable ) changeshape(type,selectable)
            
          }} 
          
          >
            <Icons 
            selected={type === selectedicon ? true : false } 
            icon={icon} 
            func={func} 
            
            />
          </div>
        ))}
      </Panel>
      <AllShapes
        vis={String(shape)}
        
        onMouseEnter={() => show_shape(true)}
        onMouseLeave={() => {if(!selectedshape) show_shape(false)}}
      >
        {controlIcon_shapes.map(({ icon, func,selectable,type }, i) => (
          <div
          onClick={() =>{
            changeshape(type,selectable)
            !selectedshape && changeselection(true);
          }} 
          key={i} 
          >
            <Icons 
            icon={icon} 
            func={func} 
           
            selected={type === selectedicon ? true : false } 
            />
          </div>
        ))}
      </AllShapes>
    </ControlBox>
  );
};

export default Controller;
