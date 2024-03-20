import { createContext, useContext } from "react";
import { FaRegCircle, FaShapes } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { CiUndo,CiRedo } from "react-icons/ci";
import { IoIosMove } from "react-icons/io";
import { MdOutlineRectangle } from "react-icons/md";

const iconContext = createContext(null);

export const IconProvider =({children})=>{

    const IconBox = {
        SHAPES:{
            name:'shapes',
            icon:FaShapes
        },
        CIRCLE:{
            name:'circle',
            icon:FaRegCircle
        },
        RECT:{
            name:'rect',
            icon:MdOutlineRectangle
        },
        DRAW:{
            name:'draw',
            icon:GoPencil
        },
        UNDO:{
            name:'undo',
            icon:CiUndo
        },
        REDO:{
            name:'redo',
            icon:CiRedo
        },
        MOVE:{
            name:'move',
            icon:IoIosMove
        }
    }

    return(
        <iconContext.Provider value={{IconBox}}>
        {children}
        </iconContext.Provider>
    )
}

export const useIcons =()=>{
    return useContext(iconContext);
}