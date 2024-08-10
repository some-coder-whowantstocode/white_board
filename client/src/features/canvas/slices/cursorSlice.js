import { createSlice } from "@reduxjs/toolkit";


export const cursorSlice = createSlice({
    name:'cursorLocation',
    initialState:{
        x:0,
        y:0
    },
    reducers:{
        update(state, action){
            state.x = action.payload.x;
            state.y = action.payload.y;
        }
    }
})

export const { update, drawMode, updatemove } = cursorSlice.actions;

export default cursorSlice.reducer