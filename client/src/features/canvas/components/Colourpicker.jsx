import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { changeColor } from '../slices/shapesSlice';
import { useDispatch } from 'react-redux';
import { addpopup } from '../../popup/slices/popupSlice';

const COLORPICKER = styled.div`
    height: 100px;
    width: 200px;
    background-color: white;
`


const Colourpicker = () => {
    const canvasref = useRef();
    const posref = useRef({x:0,y:0})
    const dispatch = useDispatch();
    console.log('color picker')
    useEffect(()=>{
        try {
        const draw =()=>{
            const canvas = canvasref.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height)
            const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
            gradient.addColorStop(0, 'white'); 
            gradient.addColorStop(1 / 8, 'orange'); 
            gradient.addColorStop(2 / 8, 'yellow'); 
            gradient.addColorStop(3 / 8, 'green'); 
            gradient.addColorStop(4 / 8, 'blue'); 
            gradient.addColorStop(5 / 8, 'indigo'); 
            gradient.addColorStop(6 / 8, 'violet');
            gradient.addColorStop(7 / 8, 'red');
            gradient.addColorStop(1, 'black');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
        }

        const drawpoint =()=>{
            const canvas = canvasref.current;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = 'gray';
            ctx.arc(posref.current.x, posref.current.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        const handleevent=(e)=>{
            if (e.buttons !== 1) return;
            const canvas = canvasref.current;
            const ctx = canvas.getContext('2d'); 
            draw();
            const x = e.offsetX; const y = e.offsetY; 
            const pixel = ctx.getImageData(x, y, 1, 1).data; 
            const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`; 
            dispatch(changeColor(rgb));
            posref.current.x = x;
            posref.current.y = y;
            drawpoint();
        }
        window.onload =()=>{
            const canvas = canvasref.current;

        draw()
        drawpoint()
        canvas.onmousedown = (e)=> handleevent(e);
        canvas.onmousemove = (e)=>handleevent(e);
        }

        
    } catch (error) {
        console.log(error)
        dispatch(addpopup('something went wrong while picking color'))
    }
    },[])
    return (
        <COLORPICKER 
        >
            <canvas ref={canvasref} height='100' width='200' ></canvas>
        </COLORPICKER>
    )
}

export default Colourpicker
