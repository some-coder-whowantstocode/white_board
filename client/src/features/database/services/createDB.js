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
   
    
}

export {
    openIndexedDB
}