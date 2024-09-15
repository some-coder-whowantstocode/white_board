import { openIndexedDB } from "./createDB";
import {handler} from '../../../helper/handler';


const removeNode = async(name)=>{
    const db = await openIndexedDB();
    const transanction = db.transaction("Folder",'readwrite');
    const store = transanction.objectStore("Folder");
    const request = store.delete(name);
    request.onsuccess = function() {
    const transanction2 = db.transaction("thumbnail",'readwrite');
        const store2 = transanction2.objectStore("thumbnail");
        console.log(store2)
        const request2 = store2.delete(name);
        request2.onsuccess = function(){
            console.log('deleted successffully')
        }
    };

    request.onerror = function() {
        console.log('Failed to delete data');
        handler(500, "error while removing node");
    };
}


export{
    removeNode
}