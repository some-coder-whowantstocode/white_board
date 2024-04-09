import React, { useRef } from 'react'

import {
    Authbox_part, Auth_icons, Auth_instructions, Auth_input, Auth_btn,
} from '../styles/auth.js'
import { useauth } from '../context/authContext.jsx'

const Authblock = ({item}) => {
    const {show, setshow} = useauth();
    const inputdata = useRef({name:'',email:'',password:''});
    
return (
    <>
        {
                
                    <Authbox_part show={`${show === item.name}`}>
                        {
                            show=== item.name ? 
                        <>
                            <p>{item.head}</p>
                        <Auth_icons>
                        {
                            item.otherways.map((logo)=>(
                                <span>{logo}</span>
                            ))
                        }
                        </Auth_icons>
                        
                        <Auth_instructions show={`${show === item.name}`}>{item.instruction}</Auth_instructions>
                        {
                            item.inputs.map((i)=>(
                                <Auth_input 
                                
                                onChange={(e)=>{
                                    console.log(e.target.value)
                                    inputdata.current[i] = e.target.value;
                                    console.log(inputdata.current)
                                }}
                                placeholder={i}/>
                            ))
                        }
                        <Auth_btn>{item.btntext}</Auth_btn>
                        </>
                            :
                            <>
                                <p>{item.alternative.head}</p>
                                <Auth_instructions>{item.alternative.instruction}</Auth_instructions>
                                <Auth_btn onClick={()=>show != item.name && setshow(item.name)}>{item.btntext}</Auth_btn>
                            </>
                        }
                    
                    </Authbox_part>
            }  
    </>
)
}

export default Authblock
