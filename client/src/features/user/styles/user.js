import styled from "styled-components";

const USER_PAGE = styled.div`
width: 100vw;
height: 100vh;
background-color: white;
display: flex;
align-items: center;
flex-direction: column;

`

const USER_DETAILS = styled.div`
display: flex;
align-items: center;
padding: 50px;
`

const  LEFT =styled.div`
width: 4vw;
height: 4vw;
font-size: 3vw;
margin-right: 20px;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid black;
border-radius: 50%;
font-weight: 500;
background-color: ${ `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`};
`

const RIGHT = styled.div`
display: flex;
flex-direction: column;

p{
    margin: 0px 0px 0px 5px;
}

input{
    width: 300px;
    height: 30px;
    outline: none;
    margin: 0px 0px 10px 10px;
}
`

const User_btn =styled.button`
    padding: 5px 10px;
    border: none;
    color: white;
    margin-right: 2rem;
    ${props=>props.col ? 
    `
    background-color: #9ac4da;
    &:hover{
    cursor:not-allowed;
    }
    `
    :
    `
    background-color: #1b60c7;
     &:hover{
    cursor:pointer;
    }
    `
}
`
export{
    USER_PAGE,
    USER_DETAILS,
    LEFT,
    RIGHT,
    User_btn
}