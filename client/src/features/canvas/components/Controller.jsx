import React, { useState } from "react";
import { styled } from "styled-components";

import { useCanvas } from "../context/canvasProvider";
import Icons from "./Icons";

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
  z-index: 2;
  /* overflow: hidden; */
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);

  @media screen and (max-width: 500px) {
    left: 20px;
  }
`;

const Panel = styled.div`
  width: 60vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: fit-content;
  border-radius: 2px 2px 10px 10px;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.75);
  @media screen and (max-width: 780px) {
    width: 100dvw;
    border-radius: 0px;
  }

  @media screen and (max-width: 500px) {
    flex-direction: column;
    width: fit-content;
    height: 100dvh;
  }
`;



const Controller = () => {
  const { controlIcons } = useCanvas();
  return (
    <ControlBox>
      <Panel >
      <Icons icons={controlIcons ? controlIcons : []}/>
      </Panel>
    </ControlBox>
  );
};

export default React.memo(Controller);
