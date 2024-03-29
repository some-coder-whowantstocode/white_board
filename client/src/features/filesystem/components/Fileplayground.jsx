import React, { useEffect } from 'react'
import styled from 'styled-components';
import Addfile from './Addfile';
import { useFile } from '../context/FileContext';
import Filecontent from './Filecontent';


const Files = styled.div`
  background-color: #cdcdcd9e;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
  justify-content: flex-start;
  overflow-y: scroll;
`

const Fileplayground = () => {
  const {currentFiles,getFiles} = useFile();

  useEffect(()=>{
    getFiles();
  },[])

  return (
    <Files>
     <Addfile/>
      {
        currentFiles.map((f,i)=>(
         <Filecontent key={i+"th file"} data={f}/>
        ))
      } 
    </Files>
  )
}

export default Fileplayground
