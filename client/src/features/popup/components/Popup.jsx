import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { removepopup } from '../slices/popupSlice'

const POPUP = styled.div`
    margin: 10px 5px;
    padding: 5px 45px 5px 15px ;
    position: relative;
    p{
        position: absolute;
        top: 3px;
        right: 8px;
        color: white;
        cursor: pointer;

        p:hover{
            color: #acacac;
        }
    }
`

const Popup = ({dataId, data}) => {

    const STYLE = useSelector(state=>state.popup.style);
    const dispatch = useDispatch();

return (
    <POPUP 
    style={{
        backgroundColor:STYLE[data.type].bg,
        color:STYLE[data.type].color
    }}
    >
        {data.msg}
        {
            <p
            onClick={()=>{
                dispatch(removepopup({id:dataId}));
            }}
            > x </p>

        }
       
    </POPUP>
) 
}

export default Popup
