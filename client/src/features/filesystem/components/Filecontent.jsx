import React from 'react'
import styled from 'styled-components'
import { IconBox } from '../../../assets/icons'
import { removeNode } from '../../database/services/indexedDB'
import { useFile } from '../context/FileContext'
import { useNavigate } from 'react-router-dom'
import { pagelocation } from '../../../pages/pagesheet'


const File = styled.div`
  height: 150px;
  width: 110px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 10px;
  overflow: hidden;
  flex:0 1 auto;
  position: relative;
  img{
    height: inherit;
  }
  div{
    position: absolute;
    top: 70%;
    left: 0;
    transition: top 0.4s;
    height: inherit;
    width: inherit;
    background-color: #a4a4a486;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  p{
    position: absolute;
    top: 2%;
    left: 75%;
    font-size: 14px;
    background-color: #8080807b;
    color: white;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s, background-color 0.2s;
    &:hover{
        background-color: #6e0202;
    }
  }

  &:hover{
    div{
        top: 20%;
    }
    p{
        opacity: 1;
    }
  }
`

const Filecontent = ({data}) => {

    const {getFiles} = useFile();
    const navigate = useNavigate();

    const deletefile = async()=>{
        try{
            await removeNode(data.canvasid,data.id);
            await getFiles();
            // console.log(data)
        }catch(err){
            console.log(err);
        }
   
    }

return (
    <File
    onClick={()=>{
        localStorage.setItem('whiteboard',data.name);
        navigate(pagelocation.canvas)
    }}
    >
        <img src={data.img} alt="" />
        <div>
            {data.name}
        </div>
        <p 
        onClick={(e)=>{
            e.stopPropagation();
            deletefile()
        }}
        >
            <IconBox.TRASH.icon/>
        </p>
    </File>
)
}

export default Filecontent
