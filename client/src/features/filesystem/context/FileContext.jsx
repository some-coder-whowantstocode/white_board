import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { coreModuleName } from "@reduxjs/toolkit/query";
import JSZip from "jszip";
import { saveAs } from 'file-saver'

import { IconBox } from "../../../assets/icons";
import { addNode, getallFiles, getoneNode, updateNode } from "../../database/services/indexedDB";
import { pagelocation } from '../../../assets/pagesheet';
import { history } from "../../../App";
import { handler } from "../../../helper/handler";
import { getoneFile } from "../../database/services/readDB";
import { popinternalProcess, pushinternalProcess } from "../../processes/slices/processSlice";
import store from "../../../store";

const fileContext = createContext(null);

export const FileProvider =({children})=>{

    const [width,setwidth] = useState(70);
    const [currentFiles,setFiles] = useState([]);
    const width_limit = {max:300,min:200,logo:70}
    const INTERNAL_PROCESSES = useSelector((state)=>state.process.internalProcesses);
    

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
            if(INTERNAL_PROCESSES){
                handler(500, "please wait patiently one request is being processed");
                return;
                }
            store.dispatch(pushinternalProcess({msg:'Downloading...'}));
            let name = localStorage.getItem('whiteboard');
        if(!name){
            handler(404,'First select a file then try to download')
            return;
        }
        
            const Data = await getoneNode(name);
            const {img} = await getoneFile(name);
            if(!Data  || !Data.name || !Data.page || !Data.page.drawing || !img) {
                handler(500,"canvas is empty draw something to download it.")
                return;
            }

            const {canvasData, shapeData, drawing} = Data.page;
            const canvasname = Data.name;
            let filedata = {
                name:canvasname,
                data:{canvasData,shapeData},
                img
            }
                if(type === "whiteboard"){
                    filedata = JSON.stringify(filedata);
                    filedata = encodeURI(filedata);
                    const zip = new JSZip();
                    zip.file(`img.whiteboard`, filedata);

                    const file = await zip.generateAsync({ type: "blob" })
                    saveAs(file,`${name}.zip`)
                }else{
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
                                a.download = `${name}.jpg`;
                                a.click();
                            }
                        break;
    
                        default:
                            {
                                const resizedImageData = newcanvas.toDataURL('image/png');
            
                                const a = document.createElement('a');
                                a.href = resizedImageData;
                                a.download = `${coreModuleName}.png`;
                                a.click();
                            }
                        break;
            
            }
                }
        handler(200,"Export successful."); 
        } catch (error) {
            console.log(error);
            handler(500,"something went wrong while downloading");
        }finally{
            store.dispatch(popinternalProcess());
        }
        
    }

    const ImportImage = async()=>{
        try {
        if(INTERNAL_PROCESSES){
            handler(500, "please wait patiently one request is being processed");
            return;
            }
        store.dispatch(pushinternalProcess("Importing...."));
        const inputbox = document.createElement('input');
        inputbox.type = 'file';
        inputbox.click();
        inputbox.oninput =async()=>{
            const selected_file = inputbox.files[0];
            if(!selected_file){
            handler(500,"file not selected");
            return;
            }
            const test = /\.zip$/;
            if(!test.test(selected_file.name)){
                handler(500,"Invalid file type please provide file that was exportate from whiteboard site ex: example.whiteboard")
                return;
            }
            
                try{
                    let filecontent = await JSZip.loadAsync(selected_file);
                    filecontent = await filecontent.file(`img.whiteboard`).async('string');
                    filecontent = decodeURI(filecontent)
                    filecontent = await JSON.parse(filecontent);
                    const {name, data, img} = filecontent;
                    if( !name || !data || !img){
                        handler(500,"Invalid data");
                        return;
                        }
                    await addNode(name);
                    await updateNode(name, data, img);
                    handler(200,"Successfully imported.")
                }catch(err){
                    console.log(err)
                handler(500,"something went wrong while processing request")
                }
                
        }
        } catch (error) {
            console.log(error);
            handler(500,"something went wrong while processing request")
        }finally{
            store.dispatch(popinternalProcess());
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
            name:IconBox.EXPORT_IMG.name,
            icon:IconBox.EXPORT_IMG.icon,
            func(){DownloadImage('whiteboard')}
        },
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
        <fileContext.Provider value={{ currentFiles, getFiles, FILE_CONTROL, width, setwidth, width_limit, BurgerMenu, selected, SHARE_CONTROL, ImportImage }}>
            {children}
        </fileContext.Provider>
    )
}

export const useFile =()=>{
    return useContext(fileContext);
}