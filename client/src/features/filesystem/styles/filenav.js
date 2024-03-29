import styled from "styled-components";


const NavBox = styled.div`
display: flex;
`

const Nav = styled.div`
width: 250px;
height: 100vh;
background-color: #00132b;
font-family: Tahoma;
color: white;
display: flex;
flex-direction: column;
`

const Sidebar = styled.div`
background-color: gray;
height: 100vh;
width: 5px;
&:hover{
    cursor:e-resize;
}
`


const Logo = styled.div`
font-size: 20px;
padding: 0 10px;
cursor: pointer;
`

const Menu = styled.div`
display: flex;
flex-direction: row-reverse;

${
    props=>props.width === "true" && `
    justify-content: center;
    `
}
`

const App_logo = styled.div`
margin: 20px 0;
display: flex;
${
    props=>props.width === "true" && `
    p{
        display:none;
    }
    `
}
`

const Top = styled.div`
box-sizing: border-box;
padding: 10px;
display: flex;
flex-direction: column;
width: 100%;
justify-content: space-between;

img{
    height: 30px;
    width: 30px;
    border-radius: 50%;
}

${
    props=> props.width === "true" && `
    flex-direction: column;
    `
}

`

const Middle = styled.div`
display: flex;
flex-direction: column;
`

const Element = styled.div`
display: flex;
padding: 10px 0;
margin: 0 10px;
border-radius: 10px;
transition: all 0.6s;
cursor: pointer;

p{
    white-space: nowrap;
}

${props=>props.width === "true" &&
        `
        justify-content: center;
        p{
        display:none;
        }
        `
    }

${props=> props.selected ? `
    color: white;
    background-color: #404040;
    `

    :
    `
    &:hover{
    color: #00132b;
    background-color: white;
    }
    `
}

`

const Bottom = styled.div`

`

export {
    App_logo,
    Menu,
    NavBox,
    Nav,
    Sidebar,
    Top,
    Logo,
    Middle,
    Element,
    Bottom,

}