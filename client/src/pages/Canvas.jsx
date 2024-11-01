import React, { useEffect, useRef, useState } from "react";
import { useCanvas } from "../features/canvas/context/canvasProvider.jsx";
import styled from "styled-components";
import { addNode, getoneNode, updateNode } from "../features/database/services/indexedDB.js";
import { useDispatch , useSelector } from "react-redux";
import { addcanvas } from "../features/canvas/slices/canvasSlice.js";
import { addLine, select, addshape, updateLine, release } from "../features/canvas/slices/shapesSlice.js";
import { history } from "../App.jsx";
import { useLocation } from "react-router-dom";
import { isloggedin } from "../features/authentication/slices/authSlice.js";
import Popups from "../features/popup/components/Popups.jsx";
import { handler } from "../helper/handler.js";
import Processings from "../features/processes/components/processings.jsx";
import Controller from "../features/canvas/components/Controller.jsx";
import coverpage from '../assets/home page.jpg'
import { DrawingBoard } from "../features/canvas/helper/index.js";

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
  const drawingboard = new DrawingBoard();
  const overCanvasRef = useRef();
  const canvasRef = useRef();
  const pageRef = useRef();
//   const mouse = useSelector((state)=>state.cursor);
//   const CANVAS = useSelector((state)=>state.canvas);
//   const MODE = useSelector((state)=>state.canvas.currentmode);
//   const SCALE =  useSelector((state)=>state.canvas.scale);
//   const SHAPE = useSelector((state)=>state.shape);
//   const SELECTED = useSelector((state)=>state.shape.select);
//   const PAGE = useSelector((state)=>state.shape.currentPage);
//   const INTERNAL_PROCESSES = useSelector((state)=>state.process.internalProcesses);
//   const { canvasRef, pageRef, overCanvasRef, moveref, drawingcanvas, setdrawing, overcontext, context } = useCanvas();
//   const [cover, setcover] = useState(true); 

//   const dispatch = useDispatch();
//   const navigate = useLocation();

//   const line = useRef([]);
//   const lineborder = useRef({x:1000000,y:1000000,h:0,w:0})

 
//   useEffect(() => {
//     history.navigater = navigate;
// }, [navigate]);


//   const [canvasmove,setmoving] = useState(false);
//   const [freedraw,setdraw] = useState(false);
//   const [hold,sethold] = useState(false);

//   const observer = new ResizeObserver(()=>{
//     const elem = moveref.current;
//   })

  


//   const SaveDrawing =async()=>{
//     try{
//       if(INTERNAL_PROCESSES) return;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       const {x, y, scale, height, width, background} = CANVAS;
//       const { store, size, color, currentPage, minpages, maxpages, pages } = SHAPE;
//       const canvasData = {x, y, scale, height, width, background};
//       const shapeData = { store, size, color, currentPage, minpages, maxpages, pages }
//       let imgData = context.getImageData(0,0,CANVAS.width ,CANVAS.height );
//       setdrawing(imgData);
//       const data = {
//         drawing:imgData,
//         canvasData,
//         shapeData
//       }
//       const img = canvas.toDataURL('image/png');
//       const name = localStorage.getItem('whiteboard');
//       if(!name){
//         localStorage.setItem('whiteboard','default');
//         addNode('default')
//         return;
//       }
//       await updateNode( name, data, img );
//     }catch(err){
//       console.log(err);
//       handler(500,"error occured while saving data");
//     }
//   }


  
//   const redraw =async()=>{
//     try {
//       if(drawingcanvas){
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         createBoard(canvas);
//           const tempcanvas = document.createElement('canvas');
//           const tempcontext = tempcanvas.getContext('2d');
  
//           tempcanvas.width = CANVAS.width;
//           tempcanvas.height = CANVAS.height;
//           // CANVAS.x,CANVAS.y
//           tempcontext.putImageData(drawingcanvas,0,0);
//       context.setTransform(1, 0, 0, 1, 0, 0);
//           context.drawImage(tempcanvas,0,0)
//       }
//     } catch (error) {
//       console.log(error);
//       handler(500,"error while")
//     }
    
    
//   }

//   useEffect(()=>{
//     redraw();
//   },[drawingcanvas])





//   useEffect(()=>{
//     draw();
//   },[PAGE]);


//   useEffect(()=>{
//       const id = setInterval(() => {
//           SaveDrawing();
//       }, 1000 * 3);

//       return ()=>{
//         clearInterval(id);
//       }
//   },[drawingcanvas,CANVAS]);

 

//   useEffect(()=>{
//     const canvas = canvasRef.current;
//     const overcanvas = overCanvasRef.current;

    // canvas.height = window.innerHeight;
    // canvas.width = window.innerWidth;
    // overcanvas.height = window.innerHeight;
    // overcanvas.width = window.innerWidth;
    // createBoard(canvas);

//     (async()=>{
//       try {
//         let name = localStorage.getItem('whiteboard') || 'default';
//           const Data = await getoneNode(name);
//           if(Data){
//             let data = Data.page;
//             if(data){
//               const { drawing, canvasData, shapeData } = data;
//               setdrawing(drawing);
//               dispatch(addcanvas(canvasData));
//               dispatch(addshape(shapeData));
//               createBoard(canvasRef.current)
//               dispatch(isloggedin());
//             }
            
//           }else{
//             name = 'default';
//             localStorage.setItem('whiteboard',name);
//             addNode(name);
//             createBoard(canvasRef.current)
//           }
          
          
//       } catch (error) {
//         console.log(error);
//         handler(500)
//       }finally{
//     setcover(false)
//       }
//     })();


//   },[])



  


//   useEffect(()=>{
//     let id;
//     const move_elem = moveref.current;
//     overCanvasredraw()
//       // id = setInterval(() => {
//       // observer.observe(move_elem)
//       // }, 1000);

//       // return()=>{
//       //     clearInterval(id);
//       // }
//     },[SELECTED])

//   useEffect(()=>{
//     draw()
//   },[SCALE,hold])
  


//   useEffect(()=>{

//     try{
//       const overcanvas = overCanvasRef.current;
     
//       window.addEventListener('mousemove', handleMove);
//       window.addEventListener('mouseup', handleup);
//       window.addEventListener('touchmove', handletouchmove);
//       overcanvas.addEventListener('mousedown', handledown);
//         overcanvas.addEventListener('touchstart', handletouchstart);
//         overcanvas.addEventListener('touchend', handletouchend);
//         overcanvas.addEventListener('touchcancel', handletouchend);

//       return () => {
//         window.removeEventListener('mousemove', handleMove);
//         window.removeEventListener('mouseup', handleup);
//         window.removeEventListener('touchmove', handletouchmove);
//         overcanvas.removeEventListener('mousedown', handledown);
//         overcanvas.removeEventListener('touchstart', handletouchstart);
//         overcanvas.removeEventListener('touchend', handletouchend);
//         overcanvas.removeEventListener('touchcancel', handletouchend);
//       };
//     }catch(err){
//       console.log(err);
//       handler(500);
//     }
//   },[hold, canvasmove, freedraw, canvasRef, createBoard, mouse, context, overcontext, CANVAS])

  useEffect(()=>{
    try {
      
      drawingboard.canvasdata.canvas = canvasRef.current;
      drawingboard.canvasdata.overcanvas = overCanvasRef.current;
      drawingboard.canvasdata.canvas.height = window.innerHeight;
      drawingboard.canvasdata.canvas.width = window.innerWidth;
      drawingboard.canvasdata.overcanvas.height = window.innerHeight;
      drawingboard.canvasdata.overcanvas.width = window.innerWidth;
      drawingboard.createBoard();

      window.addEventListener('mousedown',drawingboard.handledown.bind(drawingboard))
      window.addEventListener('mouseup',drawingboard.handleup.bind(drawingboard))
      // DrawingBoard.prototype
    } catch (error) {
      console.log(error);
    }
  },[]);
  
  return( <DRAWING_PAGE ref={pageRef} >
    {/* {
      cover && 
      <COVER_PAGE>
        <h1>whiteboard</h1>
        <img src={coverpage}/>
      </COVER_PAGE>
    } */}
    <Popups/>
    <Processings/>
    <Controller/>
    <OVER_CANVAS ref={overCanvasRef}/>
    <DRAWING_CANVAS  ref={canvasRef}/>
  </DRAWING_PAGE>)
};

export default Canvas;
