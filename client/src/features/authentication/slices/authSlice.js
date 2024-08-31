import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        rememberme:false,
        name:'auth',
        authstatus:false
    },
    reducers:{
        logIn(state,action){
            const {name} = action.payload;
            if(state.rememberme){
                localStorage.setItem(state.name,name);
            }
            sessionStorage.setItem(state.name,name);
            state.authstatus = true;
        },
        userData(state){
            let name ;
                name = localStorage.getItem(state.name);
                name = name ? name : sessionStorage.getItem(state.name);
                if(!name){
                    state.authstatus = false;
                }else{
                    state.authstatus = true;
                }
            // return name;
        },
        logOut(state){
                localStorage.removeItem(state.name);
                sessionStorage.removeItem(state.name);
                state.authstatus = false;
        },
        change_token_memory(state){
            state.rememberme = !state.rememberme;
        }
    }
})

export const { userData, logIn, change_token_memory, logOut } = authSlice.actions;

export default authSlice.reducer;