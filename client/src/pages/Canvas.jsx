import React, { useEffect, useRef, useState } from "react";
import { useCanvas } from "../features/canvas/context/canvasProvider.jsx";
import styled from "styled-components";
import { addNode, getoneNode, updateNode } from "../features/database/services/indexedDB.js";
import { useDispatch , useSelector } from "react-redux";
import { update } from "../features/canvas/slices/cursorSlice.js";
import { move, addcanvas } from "../features/canvas/slices/canvasSlice.js";
import { addLine, select, addshape, updateLine } from "../features/canvas/slices/shapesSlice.js";
import { history } from "../App.jsx";
import { useLocation } from "react-router-dom";
import { isloggedin } from "../features/authentication/slices/authSlice.js";
import Popups from "../features/popup/components/Popups.jsx";
import { handler } from "../helper/handler.js";
import Processings from "../features/processes/components/processings.jsx";
import Controller from "../features/canvas/components/Controller.jsx";
import { DrawLine } from "../features/canvas/services/DrawLine.js";
import coverpage from '../assets/home page.jpg'

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
  background-color: transparent;
  border: 3px solid black;
  /* resize: both; */
  overflow:auto;
`

const COVER_PAGE = styled.div`
  position: relative;
  height: 100dvh;
  width: 100dvw;
  z-index: 1000;
  h1{
    font-size: 4.3rem;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  img{
    height: 100dvh;
  width: 100dvw;
  }
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
  const { canvasRef, pageRef, overCanvasRef, moveref, drawingcanvas, setdrawing, overcontext, context } = useCanvas();
  const [cover, setcover] = useState(true); 

  const dispatch = useDispatch();
  const navigate = useLocation();

  const line = useRef([]);
  const lineborder = useRef({x:1000000,y:1000000,h:0,w:0})

 
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
      if(INTERNAL_PROCESSES) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
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


  const clearBoard=(CTX)=>{
    CTX.clearRect(0,0,window.innerWidth,window.innerHeight);
  }

  
  const redraw =async()=>{
    try {
      if(drawingcanvas){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        createBoard(canvas);
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
      clearBoard(context);
        context.translate(CANVAS.x,CANVAS.y);
        context.fillStyle ="white";
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
      createBoard(canv);
      const context = canv.getContext('2d');
      let arr = SHAPE.pages[PAGE-1];
      arr.map((i)=>{
      const { shape, linewidth, color, prev, id} = SHAPE.store[i];
      let draw = true;
      if(SHAPE.select && SHAPE.select.id === id) draw = false;
      if( draw){
        if(shape === 'line'){
          context.beginPath()
          context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = color;
        context.lineWidth = linewidth * SCALE;
          context.moveTo(prev[0].x * SCALE,prev[0].y * SCALE)
          for(let i=1; i<prev.length; i++){
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


  useEffect(()=>{
      const id = setInterval(() => {
          SaveDrawing();
      }, 1000 * 3);

      return ()=>{
        clearInterval(id);
      }
  },[drawingcanvas,CANVAS]);

 

  useEffect(()=>{
    const canvas = canvasRef.current;
    const overcanvas = overCanvasRef.current;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    overcanvas.height = window.innerHeight;
    overcanvas.width = window.innerWidth;
    createBoard(canvas);

    (async()=>{
      try {
        let name = localStorage.getItem('whiteboard') || 'default';
          const Data = await getoneNode(name);
          if(Data){
            let data = Data.page;
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
      }finally{
    setcover(false)
      }
    })();


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
          move_elem.style.height = `${(border.h - border.y) * SCALE}px`;
          move_elem.style.width = `${(border.w - border.x) * SCALE}px`;
          move_elem.style.top = `${(border.y * SCALE) + CANVAS.y }px`;
          move_elem.style.left = `${(border.x * SCALE) + CANVAS.x }px`;
    
          const { shape, linewidth, color, prev, id} = SELECTED;
            if(shape === 'line'){
              overcontext.beginPath();
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
      // id = setInterval(() => {
      // observer.observe(move_elem)
      // }, 1000);

      // return()=>{
      //     clearInterval(id);
      // }
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
          let x,y;
          if(type==='touch'){
            let touch = e.touches[0];
            x =  touch.pageX;
            y = touch.pageY;
          dispatch(update({ x, y}));
          }else{
            x =  e.clientX ;
            y = e.clientY ;
          }

      switch (MODE) {
            case 0:
              overCanvasredraw();
              setdraw(true);
              break;
      
            case 1:
                overCanvasredraw();
                let x1 = (x - CANVAS.x) / SCALE;
                let y1 = (y - CANVAS.y) / SCALE;
                dispatch(select({ x: x1, y: y1 }));
                draw();
                  sethold(true);

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
            setdraw(false);
            if(line.current.length > 0){
              dispatch(addLine({prev: line.current,border:lineborder.current}));
              line.current = [];
              lineborder.current = {x:0,y:0,w:0,h:0}
              const overcontext = overcanvas.getContext('2d');              
              clearBoard(overcontext);
              draw();
            }
            
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
        if(type==='touch'){
          let touch = e.touches[0];
          x =  touch.pageX;
          y = touch.pageY;
          dispatch(update({ x, y}));
        }else{
          x =  e.clientX ;
          y = e.clientY ;
        }
        
        switch (MODE) {
          case 0:
            if (freedraw) {
              DrawLine(x,y,CANVAS.x,CANVAS.y,SCALE,overCanvasRef.current,SHAPE.color,SHAPE.linewidth,line,lineborder);
            }
            break;
    
          case 1:
            console.log(hold, SHAPE.select)
            if (hold && SHAPE.select) {
              dispatch(updateLine({ i: x - mouse.x, j: y-mouse.y }));
              overCanvasredraw()
            }
            break;
    
          case 2:
            if (canvasmove) {
              dispatch(move({ x: x - mouse.x, y: y-mouse.y }));
              createBoard(canvasRef.current);
            }
            break;
        }

        if(type !== 'touch') dispatch(update({ x, y}));
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
  },[hold, canvasmove, freedraw, canvasRef, createBoard, mouse, context, overcontext, CANVAS])
  
  return( <DRAWING_PAGE ref={pageRef} >
    {
      cover && 
      <COVER_PAGE>
        <h1>whiteboard</h1>
        <img src={coverpage}/>
      </COVER_PAGE>
    }
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
