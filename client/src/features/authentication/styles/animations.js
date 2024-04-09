import { keyframes } from "styled-components";

const Moveleft = keyframes`
    0% {
        right: 0;
        width: 85%;
    }
    50%{
        right: 0%;
        width: 100%;
    }
    100% {
        right: 50%;
        width: 50%;
        z-index: 1;
    }
`

const Moveright = keyframes`
   0% {
        left: 0;
        width: 70%;
    }
    50%{
        left: 0%;
        width: 100%;
    }
    100% {
        left: 50%;
        width: 50%;
    }
`


export {
    Moveleft,
    Moveright,
}