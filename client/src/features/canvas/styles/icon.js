import styled from "styled-components";


const Icon = styled.div`
    font-size: 20px;
    margin: 10px;
    padding: 3px 5px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    width: fit-content;
    color: #00132b;
    cursor: pointer;
    &:hover{
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75);
    }
    ${props=> props.sel === "true" && `
    color:gray;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.75);
    `
}
`

export {
    Icon
}