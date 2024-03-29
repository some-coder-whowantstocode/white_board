import React, { useEffect, useRef, useState } from "react";
import { useCanvas } from "../features/canvas/context/canvasProvider.jsx";
import styled from "styled-components";
import {
  Circle,
  Line,
  Rectangle,
  CanvasTree,
} from "../features/canvas/services/canvasShapes/index.js";
import { addNode, getcurrent } from "../features/database/services/indexedDB.js";

const DRAWING_PAGE = styled.canvas`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

const Canvas = () => {
  const canvasRef = useRef(null);

  const { currentMode, MODES, SHAPES, addshapes, mouse, canvasBoard } =
    useCanvas();

  const line = useRef(null);

  const Draw = () => {
    if (currentMode.mode === MODES.Shapes) {
      let shape;
      console.log(currentMode)
      switch (currentMode.shape) {
        case SHAPES.CIRCLE:
          {
            console.log('circle');
            shape = new Circle(canvasRef.current);
            shape.draw(
              mouse.current.x,
              mouse.current.y,
              20,
              canvasBoard.current.scale,
              canvasBoard.current.x,
              canvasBoard.current.y
            );
          }
          break;

        case SHAPES.RECT:
          {
            shape = new Rectangle(canvasRef.current);
            shape.draw(
              mouse.current.x,
              mouse.current.y,
              40,
              40,
              canvasBoard.current.scale,
              canvasBoard.current.x,
              canvasBoard.current.y
            );
          }
          break;

        default: {
          shape = new Circle(canvasRef.current);
          shape.draw(
            mouse.current.x,
            mouse.current.y,
            4,
            canvasBoard.current.scale,
            canvasBoard.current.x,
            canvasBoard.current.y
          );
        }
      }
      addshapes(shape);
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    canvasBoard.current = new CanvasTree(canvas);

    (async () => {
      let filename = localStorage.getItem('whiteboard')
      if(!filename){
        localStorage.setItem('whiteboard','default');
        filename = 'default'
      }
      const oldcache = await getcurrent(filename);
      if (oldcache) {
        canvasBoard.current.convertcache(
          canvasBoard.current.current_node,
          oldcache,
          canvasBoard.current.current_cache
        );
        canvasBoard.current.draw();
      }else{
        addNode('default');
      }
    })().catch((err) => {
      console.log(err);
    });

    const handleresize = () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvasBoard.current.draw();
    };

    const handlewheel = (e) => {
      canvasBoard.current.akar_niyantranm(e);
    };

    window.addEventListener("resize", handleresize);
    canvas.addEventListener("wheel", handlewheel);

    return () => {
      window.removeEventListener("resize", handleresize);
      canvas.removeEventListener("wheel", handlewheel);
    };
  }, []);

  useEffect(() => {
    const fps = 60;
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    let animationId;
    let animationFrame;

    canvasBoard.current.draw();
    const animation = () => {
      canvasBoard.current.draw();
      animationFrame = setTimeout(() => {
        animationId = requestAnimationFrame(animation);
      }, 1000 / fps);
    };

    if (currentMode.mode === MODES.Move) {
      animation();
    }


    const handlemousemove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
  
      if (currentMode.mode === MODES.Draw && mouse.current.draw) {
        if (line.current) {
          line.current.prev.length === 1 && addshapes(line.current);
          line.current.draw(
            e.clientX,
            e.clientY,
            canvasBoard.current.scale,
            canvasBoard.current.x,
            canvasBoard.current.y
          );
        }
      }
  
      if (currentMode.mode === MODES.Move) {
        let arr = canvasBoard.current.current_node.val;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].drag) {
            arr[i].updateBorder(e.clientX, e.clientY);
          } else {
            arr[i].isHoveringOver(e.clientX, e.clientY);
          }
        }
      }
    };
  
    const handlemousedown = () => {
      if (currentMode.mode === MODES.Draw) {
        mouse.current.draw = true;
        line.current = new Line(canvasRef.current);
        line.current.context.beginPath();
      } else if (currentMode.mode === MODES.Move) {
        canvasBoard.current.Move(mouse);
      }
    };
  
    const handlemouseup = () => {
      let arr = canvasBoard.current.current_node.val;
      if (currentMode.mode === MODES.Draw) {
        line.current = null;
        mouse.current.draw = false;
        canvasBoard.current.save();
      } else if (currentMode.mode === MODES.Move) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].release();
        }
      }
    };
  

    window.addEventListener("mousemove", handlemousemove);
    canvas.addEventListener("mousedown", handlemousedown);
    window.addEventListener("mouseup", handlemouseup);

    return () => {
      window.removeEventListener("mousemove", handlemousemove);
      canvas.removeEventListener("mousedown", handlemousedown);
      window.removeEventListener("mouseup", handlemouseup);
      currentMode.mode === MODES.Move &&
        (cancelAnimationFrame(animationId), clearTimeout(animationFrame));
    };
  }, [currentMode]);

  return <DRAWING_PAGE onClick={() => Draw()} ref={canvasRef}></DRAWING_PAGE>;
};

export default Canvas;
