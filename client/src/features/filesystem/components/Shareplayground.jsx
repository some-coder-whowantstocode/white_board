import React from 'react'
import { useFile } from '../context/FileContext'
import styled from 'styled-components';
import Popups from '../../popup/components/Popups';
import Processings from '../../processes/components/processings';

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

const Shareplayground = () => {

  const { SHARE_CONTROL } = useFile();

  return (
    <SHARE_PAGE>
      <Popups/>
      <Processings/>
      {
        SHARE_CONTROL.map(({name, icon, func})=>(
          <CONTROL_ELEMENT onClick={()=>func()}>
            {React.createElement(icon,{})}
            <p>
            { name }
            </p>
            </CONTROL_ELEMENT>
        ))
      }
    </SHARE_PAGE>
  )
}

export default Shareplayground
