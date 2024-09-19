import { v4 as uuidv4 } from 'uuid';
import { openIndexedDB } from './createDB';
import { handler } from '../../../helper/handler';
import { removeNode } from './deleteDB';

const addNode = async (name) => {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('Folder', 'readwrite');
        const store = transaction.objectStore('Folder');

        const data = {
            id:uuidv4(),
            name,
            page:null
        };
        const request = store.add(data);

        return new Promise((resolve, reject) => {
        request.onsuccess = () =>{
        const transaction2 = db.transaction('thumbnail','readwrite');
        const store2 = transaction2.objectStore('thumbnail');
        const thumbnail = {
            id:uuidv4(),
            canvasid:data.id,
            img:null,
            name,
            timestamp:new Date()
        };
            const request2 = store2.add(thumbnail);
            request2.onsuccess =()=> resolve();
            request2.onerror = () => reject(request2.error);
            transaction2.onerror = () => reject(transaction2.error);
            };
        request.onerror = () => reject(request.error);
        transaction.onerror = () => reject(transaction.error);
        });
    } catch (err) {
        console.error('Error at addNode', err);
        handler(500, "error while adding node");
    }
};



const updateNode = async(name, page,img)=>{
    try {
        if(!name || !page || !img ){
            handler(500,"something went wrong.");
            return;
        }
        const db = await openIndexedDB();
        const transanction = db.transaction('Folder','readwrite');
        const store = transanction.objectStore('Folder');
        const index = store.index('files');
        const request = index.get([name])
        request.onsuccess = async()=> {
            const node = request.result;
            if(!node){
                handler(500,`!!! Looks like the data got corrupted ${name} does not exist .`);
                await removeNode(name);
                localStorage.removeItem("whiteboard");
                return;
            }
            node.page = page;
            const updateRequest = store.put(node);
            updateRequest.onsuccess = () => {
                const transaction2 = db.transaction('thumbnail','readwrite');
                const store2 = transaction2.objectStore('thumbnail');
                const index2 = store2.index('files');
                const request2 = index2.get([name]);
                request2.onsuccess = async()=>{
                    const thumbnail = request2.result;
                    if(!thumbnail){
                        handler(500,`!!! Looks like the data got corrupted ${name} does not exist .`);
                        await removeNode(name);
                        localStorage.removeItem("whiteboard");

                        return;
                    }
                    thumbnail.img = img;
                    const updatereq = store2.put(thumbnail);
    
                    updatereq.onsuccess=(()=>{
                        console.log('updated')
                    })
                }
                request2.onerror =(err)=>{
            
                }
            }
        }
        request.onerror =(err)=>{
    
        }
    } catch (error) {
        console.log(error)
        handler(500, "error while updating node");
        
    }
   
}

export{
    addNode,
    updateNode
}