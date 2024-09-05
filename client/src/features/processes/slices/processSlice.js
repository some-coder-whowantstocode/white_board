import { createSlice } from "@reduxjs/toolkit";


const processSlice =  createSlice({
    name:"process",
    initialState:{
        externalProcesses:null,
        internalProcesses:null
    },
    reducers:{
        pushexternalProcess(state, action){
            state.externalProcesses = action.payload.msg;
        },
        popexternalProcess(state){
            state.externalProcesses = null;

        },
        pushinternalProcess(state, action){
            state.internalProcesses = action.payload.msg;

        },
        popinternalProcess(state){
            state.internalProcesses = null;

        }
    }
})

export const { pushexternalProcess, popexternalProcess, pushinternalProcess, popinternalProcess } = processSlice.actions;

export default processSlice.reducer;