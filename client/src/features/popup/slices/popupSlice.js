import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const popupSlice = createSlice({
    name:'popup',
    initialState:{
        popups:{},
        types:["success", "error"],
        style:{
            "success" : {bg:"black",color:'green'},
            "error" : {bg:"black",color:'red'},
    },
        timeout:1000
    },
    reducers:{
        removepopup(state,action){
            const {id} = action.payload;
            console.log('hi',id)
            delete state.popups[id];
        },
        addpopup(state,action){
            const {msg, type} = action.payload;
            let id = uuidv4();
            state.popups[id] = {
                msg,
                type:state.types[type]
            }
        }
    }
})

export const { addpopup, removepopup } = popupSlice.actions;

export default popupSlice.reducer;