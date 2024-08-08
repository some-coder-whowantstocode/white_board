import { openIndexedDB } from "./createDB";

const getoneNode = async(name)=>{
    return new Promise((resolve,reject)=>{
        openIndexedDB()
        .then((db)=>{
            const transanction = db.transaction('Folder','readonly');
            const store = transanction.objectStore('Folder');
            const oneBoard = store.index('files');
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
    getoneNode,
    getallFiles,
    getcurrent
}