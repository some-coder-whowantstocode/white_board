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

const Movetop = keyframes`
    0% {
        top: 0;
        height: 85%;
    }
    50%{
        top: 0%;
        height: 50%;
    }
    100% {
        /* left: 50%; */
        height: 30%;
        z-index: 1;
    }
`

const Movebottom = keyframes`
   0% {
        bottom: 0;
        height: 85%;
    }
    50%{
        top: 40%;
        height: 100%;
    }
    100% {
        /* left: 50%; */
        top: 70%;
        height: 100%;
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
    Movebottom,
    Movetop
}