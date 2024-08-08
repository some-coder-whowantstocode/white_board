import { openIndexedDB } from './createDB';
import { getoneNode, getallFiles, getcurrent } from './readDB';
import { addNode, updateNode } from './updateDB';
import { removeNode } from './deleteDB';


export {
    openIndexedDB,
    addNode,
    getoneNode,
    getallFiles,
    removeNode,
    updateNode,
    getcurrent
}