import styled, { keyframes } from "styled-components";
import { LuLoader2 } from "react-icons/lu";

const PROCESSES = styled.div`
    position: fixed;
    left: 0;
    bottom: 20px;
    width: 300px;
`

const PROCESS = styled.div`
    margin: 10px 5px;
    padding: 5px 45px 5px 15px ;
    position: relative;
    background-color: black;
    display: flex;
    align-items: center;
    p{
        color: purple;
        cursor: pointer;

        p:hover{
            color: #acacac;
        }
    }
`


const rotate = keyframes`
    from {
    transform: rotate(0deg);
    }

    to {
    transform: rotate(360deg);
    }
`;

// Here we create a component that will rotate everything we pass in over two seconds
const Loading = styled(LuLoader2)`
    position: absolute;
    right: 6px;
    color: purple;
    animation: ${rotate} 2s linear infinite;
    font-size: 1.2rem;
`;


export {
    PROCESSES,
    PROCESS,
    Loading
}