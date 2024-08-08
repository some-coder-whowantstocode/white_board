import { openIndexedDB } from "./createDB";


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


export{
    removeNode
}