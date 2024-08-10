import { createContext, useContext, useRef, useState } from "react";

import { addNode, updateNode } from '../../database/services/indexedDB.js'
import { IconBox } from "../../../assets/icons.js";
import { useNavigate } from "react-router-dom";
import { pagelocation } from '../../../assets/pagesheet.js';
import { useDispatch, useSelector } from "react-redux";
import { downscale, move, upscale, changeMode, clearcanvas } from "../slices/canvasSlice.js";
import { clearshape, redo, undo } from "../slices/shapesSlice.js";



const canvasContext = createContext(null);

export const CanvasProvider =({children})=>{    
    
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const MODES = {
        Draw :0,
        Shapes:3,
        Move:1,
        Cursor:2
    }

    const SHAPES = {
        CIRCLE:IconBox.CIRCLE.name,
        RECT:IconBox.RECT.name,
        NONE:'none'
    }
    
    const canvasBoard = useRef(null);
    // const [currentMode, changeMode]  = useState({mode:MODES.Draw,shape:SHAPES.NONE});
    // const mouse = useRef({x:0,y:0,draw:false});

    const addshapes = (val)=>{
        if(canvasBoard.current){
            canvasBoard.current.add(val);
        }
    }

    const [sizes,setsizes] = useState({linewidth:4,color:"black",shapewidth:4});

    const controlIcon_shapes = [{
            icon:IconBox.CIRCLE.icon,
            func(){changeMode(3)},
            type:IconBox.DRAW.name,
            shape:IconBox.CIRCLE.name,
            mode:MODES.Shapes,
            selectable:true
        },
        {
            icon:IconBox.RECT.icon,
            func(){changeMode(3)},
            type:IconBox.DRAW.name,
            shape:IconBox.RECT.name,
            mode:MODES.Shapes,
            selectable:true
        }]

    const controlIcon_file_sys = [
        {
            icon:IconBox.SAVE.icon,
            type:IconBox.SAVE.name,
            func(){updateNode(localStorage.getItem('whiteboard'),canvasBoard.current.current_cache,canvasBoard.current.screenshot())}
        },
        {
            icon:IconBox.CREATE.icon,
            type:IconBox.CREATE.name,
            
        }
    ]

    const sizeControl_Icons = []

    const controlIcons = [
        // {
        //     icon:IconBox.SHAPES.icon,
        //     innericons:controlIcon_shapes,
        //     type:IconBox.SHAPES.name,
        //     parentIcon:true,
        // },

        {
            icon:IconBox.DRAW.icon,
            func(){dispatch(changeMode(0))},
            type:IconBox.DRAW.name,
            mode:MODES.Draw,
            shape:SHAPES.NONE,
            selectable:true,
        },

        {
            icon:IconBox.UNDO.icon,
            func(){dispatch(undo())},
            type:IconBox.UNDO.name
        },

        {
            icon:IconBox.REDO.icon,
            func(){dispatch(redo())},
            type:IconBox.REDO.name
        },

        {
            icon:IconBox.MOVE.icon,
            func(){dispatch(changeMode(1))},
            type:IconBox.MOVE.name,
            mode:MODES.Move,
            shape:SHAPES.NONE,
            selectable:true,
        },

        {
            icon:IconBox.FOLDERS.icon,
            type:IconBox.FOLDERS.name,
            func(){
                navigate(pagelocation.filespace)
                dispatch(clearshape());
                dispatch(clearcanvas());
            },
        },
        {
            icon:IconBox.USER.icon,
            type:IconBox.USER.name,
            func(){navigate(pagelocation.auth)},
        },
        {
            icon:IconBox.ADD.icon,
            func(){dispatch(upscale())},
            shape:IconBox.ADD.name,
            mode:MODES.Shapes,
        },
        {
            icon:IconBox.MINUS.icon,
            func(){dispatch(downscale())},
            shape:IconBox.MINUS.name,
            mode:MODES.Shapes,
        },
        {
            icon:IconBox.CURSOR.icon,
            func(){dispatch(changeMode(MODES.Cursor))},
            type:IconBox.CURSOR.name,
            mode:MODES.Cursor,
            shape:SHAPES.NONE,
            selectable:true
        }
    ]


    return (
        <canvasContext.Provider 
        value ={{
            MODES,
            SHAPES, 
            addshapes, 
            canvasBoard, 
            controlIcons, 
            controlIcon_shapes, 
            sizes, 
            setsizes,
            sizeControl_Icons
            }}>

        {children}

        </canvasContext.Provider>
    )
}

export const useCanvas =()=>{
    return useContext(canvasContext);
}