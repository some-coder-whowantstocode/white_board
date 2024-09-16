import { createSlice } from "@reduxjs/toolkit";


export const cursorSlice = createSlice({
    name:'cursorLocation',
    initialState:{
        x:0,
        y:0,
        movex:0,
        movey:0,
        lastx:0,
        lasty:0
    },
    reducers:{
        update(state, action){
            state.lastx = state.x;
            state.lasty = state.y;
            state.movex = action.payload.x - state.x ;
            state.movey = action.payload.y - state.y ;
            state.x = action.payload.x;
            state.y = action.payload.y;
            
        }
    }
})

export const { update, drawMode, updatemove } = cursorSlice.actions;

export default cursorSlice.reducer