import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvas } from "../features/canvas/context/canvasProvider.jsx";
import styled from "styled-components";
import {
  Circle,
  Line,
  Rectangle,
  CanvasTree,
} from "../features/canvas/services/canvasShapes/index.js";
import { addNode, getcurrent, getoneNode, updateNode } from "../features/database/services/indexedDB.js";
import { useDispatch , useSelector } from "react-redux";
import { drawMode, update, updatemove } from "../features/canvas/slices/cursorSlice.js";
import { downscale, move, addcanvas, upscale } from "../features/canvas/slices/canvasSlice.js";
import { addLine, endLine, select, addshape, updateLine } from "../features/canvas/slices/shapesSlice.js";
import { PiListDashesFill } from "react-icons/pi";

const DRAWING_PAGE = styled.div`
  height: 100%;
  width: 100%;
  max-height: 100dvh;
  overflow: hidden;

`;

const DRAWING_CANVAS = styled.canvas`
  height: 100vh;
  width: 100vw;

`

const OVER_CANVAS = styled.canvas`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
`

const MOVE_BOX = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  background-color: #bababa47;
  resize: both;
  overflow:auto;
`

const Canvas = () => {
  const mouse = useSelector((state)=>state.cursor);
  const CANVAS = useSelector((state)=>state.canvas);
  const MODE = useSelector((state)=>state.canvas.currentmode);
  const SCALE =  useSelector((state)=>state.canvas.scale);
  const SHAPE = useSelector((state)=>state.shape);
  const SELECTED = useSelector((state)=>state.shape.select);
  const PAGE = useSelector((state)=>state.shape.currentPage);

  const dispatch = useDispatch();

  const canvasRef = useRef(null);
  const pageRef = useRef(null);
  const overCanvasRef = useRef(null);
  const moveref = useRef(null);

  const [canvasmove,setmoving] = useState(false);
  const [freedraw,setdraw] = useState(false);
  const [hold,sethold] = useState(false);

  const observer = new ResizeObserver(()=>{
    const elem = moveref.current;
  })


  const SaveDrawing =()=>{
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const {x, y, scale, height, width, background} = CANVAS;
    const { store, size, color, currentPage, minpages, maxpages, pages } = SHAPE;
    const canvasData = {x, y, scale, height, width, background};
    const shapeData = { store, size, color, currentPage, minpages, maxpages, pages }
    let imgData = context.getImageData(0,0,CANVAS.width,CANVAS.height);
    const data = {
      drawing:imgData,
      canvasData,
      shapeData
    }
    let file = data;
    // file = JSON.stringify(file);
    // file = encodeURIComponent(file);
    const img = canvas.toDataURL('image/png');
    const name = localStorage.getItem('name');
    updateNode(name,file,img);
  }

  const DrawLine = () => {
    
    if(freedraw){
            const overcanvas = overCanvasRef.current;
            const overcontext = overcanvas.getContext('2d');
            let x = (mouse.x-  mouse.movex ) , y = (mouse.y- mouse.movey)  ;
            dispatch(addLine({ x:x/SCALE, y:y/SCALE}));
            overcontext.lineCap = 'round';
            overcontext.lineJoin = 'round';
            overcontext.strokeStyle = SHAPE.color;
            overcontext.lineWidth = SHAPE.linewidth * SCALE;
            overcontext.lineTo(x,y);
            overcontext.stroke();
          }
  };

  const clearBoard=(CTX)=>{
    CTX.clearRect(0,0,window.innerWidth,window.innerHeight);
  }

  
  const createBoard =(canvas)=>{
    const context = canvas.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);
      clearBoard(context);
      context.translate(mouse.movex,mouse.movey);
      context.fillStyle = CANVAS.background;
      context.fillRect(0,0,CANVAS.width * SCALE,CANVAS.height * SCALE);
    //  redraw(context)
  
  }

  const draw =()=>{
    const canv = canvasRef.current;
    let canvas = canv.getContext('2d') 
      createBoard(canv);
      let arr = SHAPE.pages[PAGE-1];
      arr.map((i)=>{
      const { shape, linewidth, color, prev, id} = SHAPE.store[i];
      let draw = true;
      if(SHAPE.select && SHAPE.select.id === id) draw = false;
      if( draw){
        if(shape === 'line'){
          canvas.beginPath()//important else it will think every drawn line as one.
          canvas.lineWidth = linewidth * SCALE;
          canvas.strokeStyle = color;
          canvas.moveTo(prev[0].x,prev[0])
          for(let i=0; i<prev.length; i++){
            canvas.lineTo(prev[i].x * SCALE,prev[i].y * SCALE);
            canvas.stroke();
          }
          canvas.closePath();
        }
      }
    })

    // Object.entries(SHAPE.store).forEach((element) => {
      
    //   //  = element[1];
   
    
    // });
  }

  const redraw =async(img)=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    createBoard(canvas)
      ctx.putImageData(img,0,0);
  }


  useEffect(()=>{
    draw();
  },[PAGE]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    const overcanvas = overCanvasRef.current;
    // const ctx = canvas.getContext('2d');
    // const overctx = overcanvas.getContext('2d');


    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    overcanvas.height = window.innerHeight;
    overcanvas.width = window.innerWidth;

    const initialize =async()=>{
      let name = localStorage.getItem('name');
      if(!name){
        name = 'default';
        localStorage.setItem('name',name);
        addNode(name);
      }else{
        const {page} = await getoneNode(name);
        let data = page;
        // data = decodeURIComponent(page);
        // data = JSON.parse(data);
        const { drawing, canvasData, shapeData } = data;
        redraw(drawing);
        useDispatch(addcanvas(canvasData));
        useDispatch(addshape(shapeData));
      }
    }

    initialize();

    // let name = CANVAS.name ;
    // if(!name){
    //   localStorage.setItem('name','default');
    //   name = 'default';
    // }
    // addNode(name)

  },[])



  const overCanvasredraw =()=>{
    const overcanvas = overCanvasRef.current;
    const overcontext = overcanvas.getContext('2d');
    overcontext.setTransform(1, 0, 0, 1, 0, 0);
    overcontext.clearRect(0,0,window.innerWidth,window.innerHeight)

    overcontext.translate(mouse.movex,mouse.movey);
      const move_elem = moveref.current;
      move_elem.style.height = `${0}px`;
      move_elem.style.width = `${0}px`;
      move_elem.style.top = `${0}px`;
      move_elem.style.left = `${0}px`;
      if(SELECTED){
  // const img = new Image();
  // img.onload = () => {
  //   // Draw the image onto the canvas
  //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // };
  
  // img.src = dataURL;
        const {border} = SHAPE.select;
        move_elem.style.height = `${border.h * SCALE}px`;
        move_elem.style.width = `${border.w * SCALE}px`;
        move_elem.style.top = `${(border.y * SCALE) + mouse.movey }px`;
        move_elem.style.left = `${(border.x * SCALE) + mouse.movex }px`;
  
        const { shape, linewidth, color, prev, id} = SELECTED;
          if(shape === 'line'){
            overcontext.beginPath()//important else it will think every drawn line as one.
            overcontext.lineWidth = linewidth * SCALE;
            overcontext.strokeStyle = color;
            overcontext.lineCap = 'round';
            overcontext.lineJoin = 'round';
            for(let i=0; i<prev.length; i++){
              overcontext.lineTo(prev[i].x * SCALE,prev[i].y * SCALE);
              overcontext.stroke();
            }
            overcontext.closePath();
          }
      
    }
  
}


  useEffect(()=>{
    let id;
    const move_elem = moveref.current;
    overCanvasredraw()
      id = setInterval(() => {
      observer.observe(move_elem)
      }, 1000);

      return()=>{
          clearInterval(id);
      }
    },[SELECTED])

  useEffect(()=>{
    draw();
  },[SCALE,hold])

  useEffect(()=>{
  
    const Page = pageRef.current;

    const fps = 0;
    let counter = 0;

    const handleMove =(e)=>{
      if(counter < fps){
        counter += 1;
        return;
      }
      counter = 0;
      dispatch(update({x:e.clientX,y:e.clientY}));
      switch(MODE){
        case 0:
          {
            if(freedraw){
              DrawLine();

            }
          }
        break;

        case 1:
          if(hold && SHAPE.select){
            dispatch(updateLine({i:e.movementX,j:e.movementY}));
            overCanvasredraw();
          }
        break;

        case 2:
          if(canvasmove){
            dispatch(updatemove({x:e.movementX,y:e.movementY}));
            createBoard(canvasRef.current);
          }
        break;
      }
    }

    const handledown =()=>{
      switch(MODE){
        case 0:
          {
            let x = (mouse.x-  mouse.movex ) /SCALE , y = (mouse.y- mouse.movey)/SCALE  ;
            dispatch(addLine({x,y}));
            setdraw(true);
            const overcanvas = overCanvasRef.current;
            const overcontext = overcanvas.getContext('2d');
            overcontext.beginPath();
            overcontext.lineCap = 'round';
            overcontext.lineJoin = 'round';
            overcontext.lineWidth = SHAPE.linewidth * SCALE;
            overcontext.strokeStyle = SHAPE.color;
            overcontext.moveTo(mouse.x,mouse.y);
            overcontext.stroke()
          }
        break;

        case 1:
          {
            let x = (mouse.x - mouse.movex) / SCALE;
            let y = (mouse.y - mouse.movey) / SCALE;
            dispatch(select({x, y}));
            sethold(prevstate=>!prevstate);
          }
        break;

        case 2:
          setmoving(true);
        break;
      }
    }

    const handleup =()=>{
      switch(MODE){
        case 0:
          const line = SHAPE.store[SHAPE.lineid];
          if(line){
            let w = line.border.w - line.border.x , h = line.border.h - line.border.y;
          }
          setdraw(false);
          dispatch(endLine());
          draw();

          const overcanvas = overCanvasRef.current;
          const overcontext = overcanvas.getContext('2d');
          clearBoard(overcontext);
         SaveDrawing()
          // createBoard(canvas);
        break;

        case 1:
          {
            sethold(false);
          }
        break;

        case 2:
          setmoving(false);
        break;
      }
    }

    window.addEventListener('mousemove',handleMove);
    Page.addEventListener('mousedown',handledown);
    window.addEventListener('mouseup',handleup);
    return()=>{
      window.removeEventListener('mousemove',handleMove);
    Page.removeEventListener('mousedown',handledown);
    window.removeEventListener('mouseup',handleup);
    }
  },[MODE,SCALE,canvasmove,overCanvasredraw,draw])

  return( <DRAWING_PAGE ref={pageRef} >
    <OVER_CANVAS ref={overCanvasRef}/>
    <DRAWING_CANVAS  ref={canvasRef}/>
    <MOVE_BOX 
    onResize={(e)=>{console.log(e)}} 
    ref={moveref}
    ></MOVE_BOX>
  </DRAWING_PAGE>)
};

export default Canvas;
