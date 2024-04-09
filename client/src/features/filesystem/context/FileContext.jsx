import { createContext, useContext, useState } from "react";
import { IconBox } from "../../../assets/icons";
import { getallFiles } from "../../database/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { pagelocation } from '../../../assets/pagesheet';

const fileContext = createContext(null);

export const FileProvider =({children})=>{

    const [width,setwidth] = useState(250);
    const [currentFiles,setFiles] = useState([]);
    const width_limit = {max:300,min:200,logo:70}

    const BurgerMenu = {
        icon:IconBox.MENU.icon,
        func(){setwidth(prevstate =>{ 
            if( prevstate === width_limit.logo ){
                return width_limit.min;
            }else{
                return width_limit.logo;
            }
        })}
    }

    const getFiles =async(files)=>{
        let thumbnails =await  getallFiles('thumbnail');
        setFiles(thumbnails);
    }

    const navigate = useNavigate();

    const FILE_CONTROL = [
        {
            name:IconBox.HOME.name,
            icon:IconBox.HOME.icon,
            func(){navigate(pagelocation.canvas)}
        },
        {
            name:IconBox.FOLDERS.name,
            icon:IconBox.FOLDERS.icon,
            func(){selected !== this.name && setselected(this.name)},
            selectable:true
        }
    ]

    const [selected,setselected] = useState(FILE_CONTROL[1].name)

    
    return(
        <fileContext.Provider value={{currentFiles,getFiles,FILE_CONTROL, width, setwidth, width_limit, BurgerMenu,selected}}>
            {children}
        </fileContext.Provider>
    )
}

export const useFile =()=>{
    return useContext(fileContext);
}