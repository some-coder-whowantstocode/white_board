import React, { useEffect } from 'react'
import styled from 'styled-components';
import Addfile from './Addfile';
import { useFile } from '../context/FileContext';
import Filecontent from './Filecontent';


const Files = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 120px;
  height: fit-content;
  /* display: grid; */
  /* grid-template-columns: repeat(auto-fill,minmax(160px, 1fr)); */
  /* min-height: 100vh; */
  overflow-y: scroll;
  /* align-items: flex-start */
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
