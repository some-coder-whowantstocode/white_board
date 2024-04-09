import { FaRegCircle, FaShapes, FaFolder, FaTrash, FaHome, FaRegUserCircle  } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { CiUndo,CiRedo } from "react-icons/ci";
import { IoIosMove, IoIosSave, IoMdAdd } from "react-icons/io";
import { MdOutlineRectangle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiEntryDoor } from "react-icons/gi";


export const IconBox = {
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
    },
    FOLDERS:{
        name:'All Files',
        icon:FaFolder
    },
    SAVE:{
        name:'save',
        icon:IoIosSave
    },
    CREATE:{
        name:'New File',
        icon:IoMdAdd 
    },
    TRASH:{
        name:'Deleted Files',
        icon:FaTrash
    },
    MENU:{
        name:'menu',
        icon:GiHamburgerMenu
    },
    HOME:{
        name:'Return',
        icon:GiEntryDoor
    },
    USER:{
        name:'user',
        icon:FaRegUserCircle
    }
}