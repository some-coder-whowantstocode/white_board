import React from 'react'
import styled from 'styled-components'
import { pagelocation } from '../../assets/pagesheet'
import { history } from '../../App'

const NOTVERIFIED = styled.div`
  height:100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  font-size: 2rem;
  font-weight: 500;
  button{
    background-color: #004aac;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 5px 10px;
    font-size: 1rem;
    margin-top: 10px;
    cursor: pointer;
    transition: all 0.3s ;
    &:hover{
        background-color: #012e69;
    }
  }
`

const Notverified = () => {
  return (
    <NOTVERIFIED>
      you are not verified please check your email to find verificaiton link.
      <button onClick={()=>history.navigate(pagelocation.canvas)}>Go back ⇾</button>
    </NOTVERIFIED>
  )
}

export default Notverified
