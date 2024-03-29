import { createContext, useContext, useRef, useState } from "react";

import { addNode, updateNode } from '../../database/services/indexedDB.js'
import { IconBox } from "../../../assets/icons.js";
import { useNavigate } from "react-router-dom";
import { pagelocation } from "../../../pages/pagesheet.js";

const canvasContext = createContext(null);

export const CanvasProvider =({children})=>{

    const navigate = useNavigate();

    const MODES = {
        Draw :'Draw',
        Shapes:'Shapes',
        Move:'Move'
    }

    const SHAPES = {
        CIRCLE:IconBox.CIRCLE.name,
        RECT:IconBox.RECT.name,
        NONE:'none'
    }
    
    const canvasBoard = useRef(null);
    const [currentMode, changeMode]  = useState({mode:MODES.Draw,shape:SHAPES.NONE});
    const mouse = useRef({x:0,y:0,draw:false});

    const addshapes = (val)=>{
        if(canvasBoard.current){
            canvasBoard.current.add(val);
        }
    }

    const [sizes,setsizes] = useState({linewidth:4,color:"black",shapewidth:4});

    const controlIcon_shapes = [{
            icon:IconBox.CIRCLE.icon,
            func(){changeMode({mode:MODES.Shapes,shape:SHAPES.CIRCLE})},
            type:IconBox.DRAW.name,
            shape:IconBox.CIRCLE.name,
            mode:MODES.Shapes,
            selectable:true
        },

        {
            icon:IconBox.RECT.icon,
            func(){changeMode({mode:MODES.Shapes,shape:SHAPES.RECT})},
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

    const controlIcons = [{
            icon:IconBox.SHAPES.icon,
            innericons:controlIcon_shapes,
            type:IconBox.SHAPES.name,
            parentIcon:true,
        },

        {
            icon:IconBox.DRAW.icon,
            func(){changeMode({mode:MODES.Draw,shape:SHAPES.NONE})},
            type:IconBox.DRAW.name,
            mode:MODES.Draw,
            shape:SHAPES.NONE,
            selectable:true,
        },

        {
            icon:IconBox.UNDO.icon,
            func(){canvasBoard.current.back()},
            type:IconBox.UNDO.name
        },

        {
            icon:IconBox.REDO.icon,
            func(){canvasBoard.current.next()},
            type:IconBox.REDO.name
        },

        {
            icon:IconBox.MOVE.icon,
            func(){changeMode({mode:MODES.Move,shape:SHAPES.NONE})},
            type:IconBox.MOVE.name,
            mode:MODES.Move,
            shape:SHAPES.NONE,
            selectable:true,
        },

        {
            icon:IconBox.FOLDERS.icon,
            type:IconBox.FOLDERS.name,
            func(){navigate(`${pagelocation.filespace}`)},
        }]


    return (
        <canvasContext.Provider 
        value ={{
            MODES,
            SHAPES, 
            addshapes, 
            currentMode, 
            mouse, 
            canvasBoard, 
            controlIcons, 
            controlIcon_shapes, 
            sizes, 
            setsizes
            }}>

        {children}

        </canvasContext.Provider>
    )
}

export const useCanvas =()=>{
    return useContext(canvasContext);
}