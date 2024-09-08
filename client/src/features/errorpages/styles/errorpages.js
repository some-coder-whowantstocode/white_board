import styled from "styled-components"


const ERRORPAGE = styled.div`
width: 100vw;
height: 100vh;
background-color: white;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
p{
    font-size: 15rem;
    font-weight: 900;
}
text{
    font-size: 5rem;
    font-weight: 900;

}
div{
    font-size: 2rem;
    font-weight: 400;
}
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

export {
    ERRORPAGE
}