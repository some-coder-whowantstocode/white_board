import { v4 as uuidv4 } from 'uuid';
import { Node_cache } from '../../canvas/services/canvasShapes/history';

const openIndexedDB = ()=>{
    return new Promise((resolve,reject)=>{
    const indexedDB = 
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB ;

    const request = indexedDB.open('whiteBoard',import.meta.env.VITE_INDEXDB_VERSION);

    request.onerror =(event)=>{
        reject("Error opening database: " + event);
    };

    request.onupgradeneeded =()=>{
        try{
            const db = request.result;
            const files = db.createObjectStore('Folder',{ keyPath : "id" });
            files.createIndex('files',['name'],{ unique : true });
            const thumnails = db.createObjectStore('thumbnail',{ keyPath : "id" });
            thumnails.createIndex('files',['name'],{ unique : true });
        }catch(err){
        reject("Error opening database: " + err);
        }
    };
    
    request.onsuccess =()=>{
        resolve(request.result);
    }
    })
    .catch(err=>{
        console.log(err);
    })
    
}

const addNode = async (name) => {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('Folder', 'readwrite');
        const store = transaction.objectStore('Folder');
        

        const data = {
            id:uuidv4(),
            node:new Node_cache(),
            name
        };
        const request = store.add(data);

        console.log(name)

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
        throw err;
    }
};

const removeNode = async(id,refid)=>{
    const db = await openIndexedDB();
    const transanction = db.transaction("Folder",'readwrite');
    const store = transanction.objectStore("Folder");
    const request = store.delete(id);

    request.onsuccess = function() {
    const transanction2 = db.transaction("thumbnail",'readwrite');
        const store2 = transanction2.objectStore("thumbnail");
        console.log(store2)
        const request2 = store2.delete(refid);
        request2.onsuccess = function(){
            console.log('deleted successffully')
        }
    };

    request.onerror = function() {
        console.log('Failed to delete data');
    };
}

const updateNode = async(name, element,img)=>{
    const db = await openIndexedDB();
    const transanction = db.transaction('Folder','readwrite');
    const store = transanction.objectStore('Folder');
    const index = store.index('files');
    const request = index.get([name])
    request.onsuccess = ()=> {
        const node = request.result;
        node.node = element;
        const updateRequest = store.put(node);
        updateRequest.onsuccess = () => {
            const transaction2 = db.transaction('thumbnail','readwrite');
            const store2 = transaction2.objectStore('thumbnail');
            const index2 = store2.index('files');
            const request2 = index2.get([name]);
            request2.onsuccess = ()=>{
                const thumbnail = request2.result;
                thumbnail.img = img;
                const updatereq = store2.put(thumbnail);

                updatereq.onsuccess=(()=>{
                    console.log('updated')
                })
            }
        }
    }
}

const getoneNode = async(name)=>{
    return new Promise((resolve,reject)=>{
        openIndexedDB()
        .then((db)=>{
            const transanction = db.transaction(SchemaName,'readonly');
            const store = transanction.objectStore(SchemaName);
            const oneBoard = store.index('white_board');

            const getone = oneBoard.get([name]);

            getone.onsuccess = ()=>{
                resolve(getone.result)
            }

            getone.onerror =(event)=>{
                reject('Error in indexedDB getoneNode: ',event.target.errorCode)
            }

            transanction.oncomplete =()=>{
                db.close();
            }
        })
    })

}

const getallFiles =async(file)=>{
    return new Promise(async(resolve,reject)=>{
        const db = await openIndexedDB();
        const transanction = db.transaction(file,'readonly');
        const store = transanction.objectStore(file);
        const request = store.getAll();
    
        request.onsuccess = function() {
            resolve(request.result);
        };
        
        request.onerror = function(err) {
            reject('Error at getallfiles',err);
        };
    })
}

const getcurrent =async(name)=>{

    return new Promise(async(resolve,reject)=>{
        const db = await openIndexedDB();
        const transanction = db.transaction('Folder','readonly');
        const store = transanction.objectStore('Folder');
        const index = store.index('files');
        const request = index.get([name])
        request.onsuccess =async function() {
            resolve( request.result ?.node);
        };
        
        request.onerror = function(err) {
            console.log(err)
            reject('Failed to get all data')
        };
        transanction.oncomplete =()=>{
            db.close();
        }
    })

}

export {
    openIndexedDB,
    addNode,
    getoneNode,
    getallFiles,
    removeNode,
    updateNode,
    getcurrent
}