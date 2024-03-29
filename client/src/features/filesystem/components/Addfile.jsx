import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { addNode } from '../../database/services/indexedDB'
import { useFile } from '../context/FileContext'

const Inputbox = styled.div`
    position: absolute;
    top: -50%;
    left: -50%;
    height: 200px;
    background-color: white;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s, left 0.8s, top 0.8s;
    ${props=>props.opacity === "true" && `
    opacity:1;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
        
    `}
`

const CrBtn = styled.button`
        border: none;
        color: white;
        padding: 5px 10px ;
        margin: 10px 0px 10px 10px;
        cursor: pointer;
        border-radius:5px;
        transition: box-shadow 0.1s;
        ${
            props=>`
            background:${props.color};
            box-shadow: ${props.color} 1px 1px 1px;
            
            &:hover{
                box-shadow: ${props.color} 2px 2px 2px;
            }

            &:active{
                box-shadow: white -1px -2px 0px ;
            }
            `
        }
        
`

const Add = styled.div`
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 150px;
  width: 120px;
  color: #767676;
  background-color: #ffffff1c;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 10px;
  cursor: pointer;
  p{
    font-size: 40px;
    
  }
`


const Input = styled.input`
    width: 200px;
    height: 30px;
    outline: none;
    border: none;
    font-size: 18px;
    border-radius: 5px;
    padding-left: 5px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    &:focus{
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px inset;
    }
`

const Addfile = () => {
    const [vis,setvis] = useState(false);
    const filename = useRef(null);
    const {getFiles} = useFile();

    const createfile = async()=>{
        try{
            await addNode(filename.current.value);
            filename.current.value = ''
            getFiles();
            setvis(false);
        }catch(err){
            console.log(err);
        }
       
    }

return (
    <>
    <Add
    onClick={()=>setvis(!vis)}
    ><p>+</p>
    </Add>     
        <Inputbox opacity={`${vis}`}>
        <Input ref={filename} placeholder='file name'/>
        <div>
        <CrBtn color={"#0584b8"} onClick={()=>createfile()} >create</CrBtn >
        <CrBtn onClick={()=>setvis(false)} color={"#454545"} >cancel</CrBtn >
        </div>
        </Inputbox>
    </>

)
}

export default Addfile
