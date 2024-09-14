import { FaRegCircle, FaShapes, FaFolder, FaTrash, FaRegUserCircle, FaPlus, FaMinus  } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { CiUndo,CiRedo } from "react-icons/ci";
import { IoIosMove, IoIosSave, IoMdAdd } from "react-icons/io";
import { MdOutlineRectangle } from "react-icons/md";
import { GiHamburgerMenu, GiEntryDoor } from "react-icons/gi";
import { BsFillCursorFill } from "react-icons/bs";
import { FaShareFromSquare } from "react-icons/fa6";
import { AiOutlineExport } from "react-icons/ai";
import { BiSolidFileJpg, BiSolidFilePng } from "react-icons/bi";
import { CiImport } from "react-icons/ci";

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
    },
    ADD:{
        name:'add',
        icon:FaPlus
    },
    MINUS:{
        name:'minus',
        icon:FaMinus
    },
    CURSOR:{
        name:'cursor',
        icon:BsFillCursorFill
    },
    SHARE:{
        name:'share',
        icon:FaShareFromSquare
    },
    EXPORT_IMG:{
        name:'Download Whiteboard',
        icon:AiOutlineExport
    },
    IMPORT_IMG:{
        name:'IMPORT',
        icon:CiImport
    },
    JPG:{
        name:'Export JPG',
        icon:BiSolidFileJpg
    },
    PNG:{
        name:'Export PNG',
        icon:BiSolidFilePng
    },
}