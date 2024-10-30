import React from 'react'
import { useFile } from '../context/FileContext'
import styled from 'styled-components';
import Popups from '../../popup/components/Popups';
import Processings from '../../processes/components/processings';
import { IconBox } from '../../../assets/icons';
import { v4 } from 'uuid';

const SHARE_PAGE = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #cdcdcd9e;
`

const CONTROL_ELEMENT = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 2rem 3rem;
  font-size: 1.2rem;
  background-color: #dadada9e;
  padding: 0.3rem;
  p{
    padding-left: 0.6rem;
  }
  &:hover{
    text-decoration: underline;
  }
`

const IMPORT = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.5rem 1rem;
  font-size: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 2rem;
  border-radius: 1rem;
  background-color: #ffffff55;
  cursor: pointer;
  color: #3b3b3b;
  &:hover{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 12px;
  color: black;
  }
  &:active{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px inset;
  }
`

const Shareplayground = () => {

  const { SHARE_CONTROL, ImportImage } = useFile();

  return (
    <SHARE_PAGE>
      <Popups/>
      <Processings/>
      {
        SHARE_CONTROL.map(({name, icon, func})=>(
          <CONTROL_ELEMENT 
          key={v4()}
          onClick={()=>func()}
          >
            {React.createElement(icon,{})}
            <p>
            { name }
            </p>
            </CONTROL_ELEMENT>
        ))
      }
      <IMPORT 
      onClick={()=>{
        ImportImage()
      }}
      title='Import drawing canvas'
      >
        {
          React.createElement(IconBox.IMPORT_IMG.icon,{})
        }
      </IMPORT>
    </SHARE_PAGE>
  )
}

export default Shareplayground
