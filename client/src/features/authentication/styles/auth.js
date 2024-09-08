import styled, { css } from 'styled-components'

import {
    Movebottom,
    Moveleft, Moveright,
    Movetop,
} from './animations'

const Authpage = styled.div`
    background-color: #c5d4e4;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: white;
    transition: all 0.5s;

`

const Authbox = styled.div`
    transition: all 0.3s;
    /* width: fit-content; */
    /* height: fit-content ; */
    background-color: transparent;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* padding: 40px; */
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    position: relative;

    @media screen and (max-width: 700px) {
        flex-direction: column;
    }
`


const Styledbackground = styled.div`
    position: absolute;
    width: 50%;
    height: 100%;
    transition: all 0.5s;
    top: 0px;
    background-color: #7724e2;
    z-index: 1;
    ${
        props=> props.show === 'signin' ?

        css`
        border-radius: 2rem;
        animation: ${Moveright} 0.5s linear forwards;
        `
        :
        css`
        border-radius: 2rem;
        animation: ${Moveleft} 0.5s linear forwards;
        `
    }

    @media screen and (max-width: 700px) {
    position: absolute;
    width: 100%;
    height: 50%;
    transition: all 0.5s;
    top: 0px;
    background-color: #7724e2;
    z-index: 1;
    ${
        props=> props.show === 'signin' ?

        css`
        border-radius: 2rem;
        animation: ${Movebottom} 0.5s linear forwards;
        `
        :
        css`
        border-radius: 2rem;
        animation: ${Movetop} 0.5s linear forwards;
        `
    }
    }
    
`


const Authbox_part = styled.div`
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-around ;
    flex-direction: column;
    transition: opacity 0.6s;
    line-height: 3;
    padding: 3rem;
    a{
        font-weight: 300;
        text-decoration: underline;
        color: blue;
        cursor: pointer;
        font-size:0.8rem;
    }
    p{
        white-space: nowrap;
        font-size: clamp(15px,2vw,200px);
        font-weight: 700;
    }
    z-index:0;
    ${ props=>props.show === 'false' && css`
    z-index:2;
    `
    }
    @media screen and (max-width: 700px){
    padding: 1rem;
    }
`

const HIDDEN_AUTH_PART = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
p{
    color: white;
}
`

const Auth_icons = styled.div`
    span{
        padding: 7px;
        margin: 0px 5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }

`

const Auth_instructions = styled.div`
    color: gray;
    font-size: clamp(1rem,1vw,200px);
    line-height: 1;
    padding:0.5rem 0 1rem 0;
    ${
        props=> props.show !== 'true' && css` color:white;`
    }
`

const Auth_input = styled.input`
    height: 30px;
    border: 2px solid gray;
    outline: none;
    width: 200px;
    font-size: 17px;
    padding-left: 4px;
    box-sizing: border-box;
    margin: 4px;
`

const Auth_btn = styled.button`
    padding: 5px 10px;
    border:none;
    background-color: #7724e2;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid white;
`

const Auth_logo = styled.div`
display: flex;
position: absolute;
top: 10px;
left: 10px;
align-items: center;
justify-content: center;
img{
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 1px solid gray;
cursor: pointer;

}
span{
    cursor: pointer;
    font-size: 23px;
}
`

const Rememberme = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin: 0;
p{
    font-size: 16px;
    font-weight: 400;
}
`

export {
    Authpage,
    Authbox,
    Authbox_part,
    Auth_icons,
    Auth_instructions,
    Auth_input,
    Auth_btn,
    Styledbackground,
    Auth_logo,
    Rememberme,
    HIDDEN_AUTH_PART
}