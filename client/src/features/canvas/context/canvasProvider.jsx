import { createContext, useContext, useRef, useState } from "react";
import { useIcons } from "./iconContext";

const canvasContext = createContext(null);

export const CanvasProvider =({children})=>{

    const { IconBox } = useIcons();

    const MODES = {
        Draw :'Draw',
        Shapes:'Shapes',
        Move:'Move'
    }

    const SHAPES = {
        CIRCLE:'circle',
        RECT:'rectangle',
        NONE:'none'
    }
    
    const canvasBoard = useRef(null);
    const [currentMode, changeMode]  = useState({mode:MODES.Draw,shapes:SHAPES.NONE});
    const mouse = useRef({x:0,y:0,draw:false});

    const addshapes = (val)=>{
        if(canvasBoard.current){
            canvasBoard.current.add(val);
        }
    }

    const [sizes,setsizes] = useState({linewidth:4,color:"black",shapewidth:4});

    const controlIcons = [
        {
        icon:IconBox.DRAW.icon,
        func(){changeMode({mode:MODES.Draw,shapes:SHAPES.NONE})},
        type:IconBox.DRAW.name,
        selectable:true
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
        func(){changeMode({mode:MODES.Move,shapes:SHAPES.NONE})},
        type:IconBox.MOVE.name,
        selectable:true
        }
    ]

    const controlIcon_shapes = [
        {
        icon:IconBox.CIRCLE.icon,
        func(){changeMode({mode:MODES.Shapes,shapes:SHAPES.CIRCLE})},
        type:IconBox.CIRCLE.name,
        selectable:true
        },
        {
        icon:IconBox.RECT.icon,
        func(){changeMode({mode:MODES.Shapes,shapes:SHAPES.RECT})},
        type:IconBox.RECT.name,
        selectable:true
        }
    ]

    return (
        <canvasContext.Provider value ={{MODES,SHAPES, addshapes, currentMode, changeMode, mouse, canvasBoard, controlIcons, controlIcon_shapes, sizes, setsizes}}>
            {children}
        </canvasContext.Provider>
    )
}

export const useCanvas =()=>{
    return useContext(canvasContext);
}