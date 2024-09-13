import { createContext, useContext, useState } from "react";
import { IconBox } from "../../../assets/icons";
import { getallFiles, getoneNode } from "../../database/services/indexedDB";
import { pagelocation } from '../../../assets/pagesheet';
import { history } from "../../../App";
import { useCanvas } from "../../canvas/context/canvasProvider";
import { handler } from "../../../helper/handler";

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
        try{
            let thumbnails =await  getallFiles('thumbnail');
            setFiles(thumbnails);
        }catch(err){
            console.log(err);
            handler(500,"Something went wrong");
        }
       
    }

    const DownloadImage = async(type, height, width)=>{
        try {
            let name = localStorage.getItem('whiteboard');
        if(!name){
            handler(404,'First select a file then try to download')
            return;
        }
        
            const Data = await getoneNode(name);
            if(Data.page){
            let data = Data.page;
            const { drawing } = data;
            if(!drawing){
                handler(500,"canvas is empty draw something to download it.")
                return;
            }
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = drawing.height;
                canvas.width = drawing.width;
                ctx.putImageData(drawing,0,0);
                const newcanvas = document.createElement('canvas');
                const newctx = newcanvas.getContext('2d');
                newcanvas.width = width;
                newcanvas.height = height;
        
                newctx.drawImage(canvas,0,0,width,height);

                switch(type){
                    case "png":
                        {
                            const resizedImageData = newcanvas.toDataURL('image/png');
        
                            const a = document.createElement('a');
                            a.href = resizedImageData;
                            a.download = "whiteboard img.png";
                            a.click();
                        }
                    break;

                    case "jpg":
                        {
                            const resizedImageData = newcanvas.toDataURL('image/jpeg');
        
                            const a = document.createElement('a');
                            a.href = resizedImageData;
                            a.download = "whiteboard img.jpg";
                            a.click();
                        }
                    break;

                    default:
                        {
                            const resizedImageData = newcanvas.toDataURL('image/png');
        
                            const a = document.createElement('a');
                            a.href = resizedImageData;
                            a.download = "whiteboard img.png";
                            a.click();
                        }
                    break;
                }
        
               
        }
        } catch (error) {
            console.log(error);
            handler(500,"something went wrong please try again later");
        }
        
    }


    const FILE_CONTROL = [
        {
            name:IconBox.HOME.name,
            icon:IconBox.HOME.icon,
            func(){history.navigate(pagelocation.canvas)}
        },
        {
            name:IconBox.FOLDERS.name,
            icon:IconBox.FOLDERS.icon,
            func(){selected !== this.name && setselected(this.name)},
            selectable:true
        },
        {
            name:IconBox.SHARE.name,
            icon:IconBox.SHARE.icon,
            func(){selected !== this.name && setselected(this.name)},
            selectable:true
        }
    ]


    const SHARE_CONTROL = [
      
        {
            name:IconBox.PNG.name,
            icon:IconBox.PNG.icon,
            func(){DownloadImage('png',400,500)}
        },
        {
            name:IconBox.JPG.name,
            icon:IconBox.JPG.icon,
            func(){DownloadImage("jpg",500,400)}
        },
    ]

    const [selected,setselected] = useState(FILE_CONTROL[1].name)
    
    return(
        <fileContext.Provider value={{ currentFiles, getFiles, FILE_CONTROL, width, setwidth, width_limit, BurgerMenu, selected, SHARE_CONTROL }}>
            {children}
        </fileContext.Provider>
    )
}

export const useFile =()=>{
    return useContext(fileContext);
}