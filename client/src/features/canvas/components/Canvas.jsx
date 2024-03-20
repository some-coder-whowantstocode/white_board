import React, { useEffect, useRef } from 'react'
import { useCanvas } from '../context/canvasProvider.jsx';
import styled from 'styled-components';
import {Circle, Line, Rectangle,Node, CanvasTree } from '../services/index.js'


const DRAWING_PAGE = styled.canvas`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  /* background-color: white; */
`

const Canvas = () => {

    const canvasRef = useRef(null);

    const {currentMode, MODES, SHAPES, addshapes, mouse , canvasBoard} = useCanvas();

    const line = useRef(null);


    const Draw = ()=>{
      if(currentMode.mode === MODES.Shapes){
        let shape ;
        switch(currentMode.shapes){
          case SHAPES.CIRCLE:
            {
              shape = new Circle(canvasRef);
              shape.draw(mouse.current.x,mouse.current.y,20);
            }
          break;

          case SHAPES.RECT:
            {
              shape = new Rectangle(canvasRef.current);
              shape.draw(mouse.current.x,mouse.current.y,40,40);
            }
          break;

          default:
            {
              shape = new Circle(canvasRef);
              shape.draw(mouse.current.x,mouse.current.y,4);
            }

        }
        addshapes(shape);
      
      }
    
    }

    const handlemousemove =(e)=>{
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if(currentMode.mode === MODES.Draw && mouse.current.draw){
        line.current && line.current.draw(e.clientX,e.clientY,canvasBoard.current.scale);
      }

      if(currentMode.mode=== MODES.Move){
        let arr = canvasBoard.current.current_node.val;
        for(let i =0;i<arr.length;i++){
          
          if(arr[i].drag){
            arr[i].move(e.clientX,e.clientY);
          }else{
            arr[i].hovering_over(e.clientX,e.clientY)
          }
        }
      }
    }

    const handlemousedown =()=>{
      if(currentMode.mode === MODES.Draw){
        mouse.current.draw = true;
        line.current = new Line(canvasRef.current);
        line.current.context.beginPath();
        addshapes(line.current);
      }
      else if(currentMode.mode === MODES.Move){
      canvasBoard.current.Move(mouse);
      }
    }

    const handlemouseup =()=>{
      let arr = canvasBoard.current.current_node.val;
      if(currentMode.mode === MODES.Draw){
        mouse.current.draw = false;
      }
      else if(currentMode.mode === MODES.Move){
        for(let i =0;i<arr.length;i++){
          arr[i].release();
      }
      }
    }

    useEffect(()=>{
    
      const canvas = canvasRef.current;
     
      canvasBoard.current = new CanvasTree(canvas,new Node());

      const handleresize =()=>{
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth ;
        canvasBoard.current.draw()
      }

      const handlewheel =(e)=>{
        canvasBoard.current.akar_niyantranm(e);
      }

      window.addEventListener('resize',handleresize);
      canvas.addEventListener('wheel',handlewheel);

      return ()=>{
        window.removeEventListener('resize',handleresize);
        canvas.removeEventListener('wheel',handlewheel);
      }

    },[])



    useEffect(()=>{
      
      const fps = 60;
      const canvas = canvasRef.current;
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth ;
      let animationId ;
      let animationFrame ;

      canvasBoard.current.draw()
      const animation = ()=>{
        canvasBoard.current.draw();
        animationFrame = setTimeout(()=>{
          animationId = requestAnimationFrame(animation);
        },1000/fps);
      }

      if(currentMode.mode === MODES.Move){
        animation();
      }

      window.addEventListener('mousemove',handlemousemove);
      canvas.addEventListener('mousedown',handlemousedown);
      window.addEventListener('mouseup',handlemouseup);


        return()=>{
          window.removeEventListener('mousemove',handlemousemove);
          canvas.removeEventListener('mousedown',handlemousedown);
          window.removeEventListener('mouseup',handlemouseup);
          currentMode.mode === MODES.Move && (cancelAnimationFrame(animationId) , clearTimeout(animationFrame));
        }
    },[currentMode]) 

  return (
    <DRAWING_PAGE
    onClick={()=>Draw()}
    ref={canvasRef}>
    </DRAWING_PAGE>
  )
}

export default Canvas
