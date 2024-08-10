import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export const canvasSlice = createSlice({
    name:'canvas',
    initialState:{
        x:0,
        y:0,
        scale:1,
        height:window.innerHeight,
        width:window.innerWidth,
        maxscale:2,
        minscale:0.2,
        scaleunit:0.1,
        background:'white',
        modes:['draw','move','cursor','shapes'],
        currentmode:0,
    },
    reducers:{
        clearcanvas(state){
            state.x=0,
            state.y=0,
            state.scale=1,
            state.height=window.innerHeight,
            state.width=window.innerWidth,
            state.maxscale=2,
            state.minscale=0.2,
            state.scaleunit=0.1,
            state.background='white',
            state.modes=['draw','move','cursor','shapes'],
            state.currentmode=0
        },
        addcanvas(state,action){
            let obj = action.payload;
            Object.keys(obj).forEach(key => {
                state[key] = obj[key];
            });
            console.log(state.x,state.y,action.payload)
        },
        move(state,action){
            state.x += action.payload.x;
            state.y += action.payload.y;
            
        },
        changeMode(state,action){
            state.currentmode = action.payload
        },
        upscale(state){
            if(state.scale >= state.maxscale) return;
            state.scale += state.scaleunit;
        },
        downscale(state){
            if(state.scale <= state.minscale) return;
            state.scale -= state.scaleunit;
        },
        changebackground(state,action){
            state.background = action.payload;
        }
    }
})

export const { move, upscale, downscale, changebackground, changeMode, addcanvas, clearcanvas } = canvasSlice.actions;

export default canvasSlice.reducer;