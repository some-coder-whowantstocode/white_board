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
import { history } from "../App.jsx";
import { useLocation } from "react-router-dom";
import { isloggedin } from "../features/authentication/slices/authSlice.js";
import Popups from "../features/popup/components/Popups.jsx";
import { handler } from "../helper/handler.js";
import Processings from "../features/processes/components/processings.jsx";
import { popinternalProcess, pushinternalProcess } from "../features/processes/slices/processSlice.js";
import Controller from "../features/canvas/components/Controller.jsx";

const DRAWING_PAGE = styled.div`
  height: 100dvh;
  width: 100dvw;
  /* max-height: 100dvh; */
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
  touch-action: none;
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
  const INTERNAL_PROCESSES = useSelector((state)=>state.process.internalProcesses);
  const { canvasRef, pageRef, overCanvasRef, moveref, drawingcanvas, setdrawing, overcontext, context, setctx, setoverctx } = useCanvas();

  const dispatch = useDispatch();
  const navigate = useLocation();

 
  useEffect(() => {
    history.navigater = navigate;
}, [navigate]);


  const [canvasmove,setmoving] = useState(false);
  const [freedraw,setdraw] = useState(false);
  const [hold,sethold] = useState(false);

  const observer = new ResizeObserver(()=>{
    const elem = moveref.current;
  })

  


  const SaveDrawing =async()=>{
    try{
      console.log(INTERNAL_PROCESSES)
      if(INTERNAL_PROCESSES) return;
      // const canvas = canvasRef.current;
      // const context = canvas.getContext('2d');
      const {x, y, scale, height, width, background} = CANVAS;
      const { store, size, color, currentPage, minpages, maxpages, pages } = SHAPE;
      const canvasData = {x, y, scale, height, width, background};
      const shapeData = { store, size, color, currentPage, minpages, maxpages, pages }
      let imgData = context.getImageData(0,0,CANVAS.width ,CANVAS.height );
      setdrawing(imgData);
      const data = {
        drawing:imgData,
        canvasData,
        shapeData
      }
      const img = canvas.toDataURL('image/png');
      const name = localStorage.getItem('whiteboard');
      if(!name){
        localStorage.setItem('whiteboard','default');
        addNode('default')
        return;
      }
      await updateNode( name, data, img );
    }catch(err){
      console.log(err);
      handler(500,"error occured while saving data");
    }
  }

  const DrawLine = () => {
    try{
        // const canvas = overCanvasRef.current;
        // const overcontext = canvas.getContext('2d');
        let x = (mouse.x-  CANVAS.x )/SCALE , y = (mouse.y- CANVAS.y)/SCALE  ;
        dispatch(addLine({ x, y}));
        overcontext.beginPath()
        // overcontext.moveTo(mouse.x-CANVAS.x,mouse.y-CANVAS.y);
        overcontext.lineCap = 'round';
        overcontext.lineJoin = 'round';
        overcontext.strokeStyle = SHAPE.color;
        overcontext.lineWidth = SHAPE.linewidth * SCALE;
        overcontext.moveTo(mouse.lastx-CANVAS.x,mouse.lasty-CANVAS.y);
        overcontext.lineTo(mouse.x-CANVAS.x,mouse.y-CANVAS.y);
        overcontext.stroke();
        // overcontext.closePath()
    }catch(err){
      console.log(err);
      handler(500,"something went wrong.");
    }
    
  };

  const clearBoard=(CTX)=>{
    CTX.clearRect(0,0,window.innerWidth,window.innerHeight);
  }

  
  const redraw =async()=>{
    try {
      if(drawingcanvas){
        // const canvas = canvasRef.current;
        // const context = canvas.getContext('2d');
        // createBoard(canvas);
          const tempcanvas = document.createElement('canvas');
          const tempcontext = tempcanvas.getContext('2d');
  
          tempcanvas.width = CANVAS.width;
          tempcanvas.height = CANVAS.height;
          // CANVAS.x,CANVAS.y
          tempcontext.putImageData(drawingcanvas,0,0);
      context.setTransform(1, 0, 0, 1, 0, 0);
          context.drawImage(tempcanvas,0,0)
      }
    } catch (error) {
      console.log(error);
      handler(500,"error while")
    }
    
    
  }

  useEffect(()=>{
    redraw();
  },[drawingcanvas])

  const createBoard =(canvas)=>{
    try {
      const context = canvas.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);
      console.log(CANVAS.x,CANVAS.y)
      clearBoard(context);
        context.translate(CANVAS.x,CANVAS.y);
        context.fillStyle = CANVAS.background;
        context.fillRect(0,0,CANVAS.width * SCALE,CANVAS.height * SCALE);
        // drawingcanvas && context.putImageData(drawingcanvas,0,0);
      
    } catch (error) {
      console.log(error);
      handler(500)
    }
  }

  const draw =()=>{
    try {
      const canv = canvasRef.current;
      if(!canv) return;
      // let context = canv.getContext('2d') 
      createBoard(canv);
      let arr = SHAPE.pages[PAGE-1];
      arr.map((i)=>{
      const { shape, linewidth, color, prev, id} = SHAPE.store[i];
      let draw = true;
      if(SHAPE.select && SHAPE.select.id === id) draw = false;
      if( draw){
        if(shape === 'line'){
          context.beginPath()//important else it will think every drawn line as one.
          context.lineWidth = linewidth * SCALE;
          context.strokeStyle = color;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.moveTo(prev[0].x,prev[0].y)
          for(let i=0; i<prev.length; i++){
            context.lineTo(prev[i].x * SCALE,prev[i].y * SCALE);
            context.stroke();
          }
          context.closePath();
        }
        
      }
    })
    
  } catch (error) {
    console.log(error);
    handler(500)
  }
  }



  useEffect(()=>{
    draw();
  },[PAGE]);


  // useEffect(()=>{
  //     const id = setInterval(() => {
  //     console.log(drawingcanvas)
  //         SaveDrawing();
  //     }, 1000 * 3);

  //     return ()=>{
  //       clearInterval(id);
  //     }
  // },[drawingcanvas,CANVAS]);

 

  useEffect(()=>{
    const canvas = canvasRef.current;
    const overcanvas = overCanvasRef.current;
    let context = canvas.getContext('2d');
    let overcontext = overcanvas.getContext('2d');
    setctx(context);
    setoverctx(overcontext);

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    overcanvas.height = window.innerHeight;
    overcanvas.width = window.innerWidth;
    createBoard(canvasRef.current);

    const initialize =async()=>{
      try {
  console.log("hmmmmm")
        let name = localStorage.getItem('whiteboard') || 'default';
          const Data = await getoneNode(name);
          if(Data){
            let data = Data.page;
            console.log(Data)
            if(data){
              const { drawing, canvasData, shapeData } = data;
              setdrawing(drawing);
              dispatch(addcanvas(canvasData));
              dispatch(addshape(shapeData));
              createBoard(canvasRef.current)
              dispatch(isloggedin());
            }
            
          }else{
            name = 'default';
            localStorage.setItem('whiteboard',name);
            addNode(name);
            createBoard(canvasRef.current)
          }
          
          
      } catch (error) {
        console.log(error);
        handler(500)
      }
    }

    initialize();

  },[])



  const overCanvasredraw =()=>{
    try {
      
      const overcanvas = overCanvasRef.current;
      const overcontext = overcanvas.getContext('2d');
      // if(!overcontext) return;
      overcontext.setTransform(1, 0, 0, 1, 0, 0);
      overcontext.clearRect(0,0,window.innerWidth,window.innerHeight)
  
      overcontext.translate(CANVAS.x,CANVAS.y);
        const move_elem = moveref.current;
        move_elem.style.height = `${0}px`;
        move_elem.style.width = `${0}px`;
        move_elem.style.top = `${0}px`;
        move_elem.style.left = `${0}px`;
        if(SELECTED){
    
    
          const {border} = SHAPE.select;
          move_elem.style.height = `${border.h * SCALE}px`;
          move_elem.style.width = `${border.w * SCALE}px`;
          move_elem.style.top = `${(border.y * SCALE) + CANVAS.y }px`;
          move_elem.style.left = `${(border.x * SCALE) + CANVAS.x }px`;
    
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
    } catch (error) {
      console.log(error);
      handler(500)
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
    draw()
  },[SCALE,hold])
  


  useEffect(()=>{

    try{
      const overcanvas = overCanvasRef.current;
      const handledown = (e,type) => {
        try{
          // if(mouse.x ===0 && mouse.y ===0) return;
          if(type==='touch'){
            let touch = e.touches[0];
        let x =  touch.pageX;
        let y = touch.pageY;
        dispatch(update({x,y}));

          }
          switch (MODE) {
            case 0:
              // overCanvasredraw();
              let x = (mouse.x - CANVAS.x) / SCALE,
                y = (mouse.y - CANVAS.y) / SCALE;
              dispatch(addLine({ x, y }));
              setdraw(true);
              break;
      
            case 1:
              overCanvasredraw();
              let x1 = (mouse.x - CANVAS.x) / SCALE;
              let y1 = (mouse.y - CANVAS.y) / SCALE;
              dispatch(select({ x: x1, y: y1 }));
              draw();
              sethold((prevstate) => !prevstate);
              break;
      
            case 2:
              overCanvasredraw();
              setmoving(true);
              break;
          }
        }catch(err){
          console.log(err);
          handler(500)
        }
        
      }
    
      const handletouchstart =(e)=>{
        e.preventDefault();
        handledown(e,'touch');
        // console.log(mouse.x,mouse.y)
      }
  
      const handleup = () => {
        try {
        switch (MODE) {
          case 0:
            const line = SHAPE.store[SHAPE.lineid];
            if (line) {
              let w = line.border.w - line.border.x,
                h = line.border.h - line.border.y;
            }
            overcontext.closePath();
            setdraw(false);
            dispatch(endLine());
            clearBoard(overcontext);
            draw();
            break;
    
          case 1:
            sethold(false);
            if (hold) {
              draw();
            }
            break;
    
          case 2:
            setmoving(false);
            canvasmove && draw();
            break;
        }
      } catch (error) {
        console.log(error);
        handler(500)
      }
      };
    
  
      const handletouchend =(e)=>{
        e.preventDefault();
        handleup(e);
      }

      const handleMove = (e,type) => {
        try {
        let x,y;
        console.log(mouse)
        if(type==='touch'){
          let touch = e.touches[0];
          x =  touch.pageX;
          y = touch.pageY;
          if(mouse.x === x && mouse.y === y) return;
        }else{
          x =  e.clientX ;
          y = e.clientY ;
        }
        dispatch(update({ x, y}));
        switch (MODE) {
          case 0:
            if (freedraw) {
              DrawLine();
            }
            break;
    
          case 1:
            if (hold && SHAPE.select) {
              dispatch(updateLine({ i: mouse.movex, j: mouse.movey }));
            }
            break;
    
          case 2:
            if (canvasmove) {
              dispatch(move({ x:mouse.movex, y:  mouse.movey }));
              createBoard(canvasRef.current);
            }
            break;
        }
      } catch (error) {
        console.log(error);
        handler(500)
      }
      };

      const handletouchmove =(e)=>{
        e.preventDefault();
        handleMove(e,'touch');
      }

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleup);
      window.addEventListener('touchmove', handletouchmove);
      overcanvas.addEventListener('mousedown', handledown);
        overcanvas.addEventListener('touchstart', handletouchstart);
        overcanvas.addEventListener('touchend', handletouchend);
        overcanvas.addEventListener('touchcancel', handletouchend);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleup);
        window.removeEventListener('touchmove', handletouchmove);
        overcanvas.removeEventListener('mousedown', handledown);
        overcanvas.removeEventListener('touchstart', handletouchstart);
        overcanvas.removeEventListener('touchend', handletouchend);
        overcanvas.removeEventListener('touchcancel', handletouchend);
      };
    }catch(err){
      console.log(err);
      handler(500);
    }
  },[hold, canvasmove, freedraw, canvasRef, createBoard, mouse, context, overcontext])
  
  return( <DRAWING_PAGE ref={pageRef} >
    <Popups/>
    <Processings/>
    <Controller/>
    <OVER_CANVAS ref={overCanvasRef}/>
    <DRAWING_CANVAS  ref={canvasRef}/>
    <MOVE_BOX 
    onResize={(e)=>{console.log(e)}} 
    ref={moveref}
    ></MOVE_BOX>
  </DRAWING_PAGE>)
};

export default Canvas;
