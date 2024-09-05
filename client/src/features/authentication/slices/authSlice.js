import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        rememberme:false,
        name:'auth',
        authstatus:false,
        
    },
    reducers:{
        logIn(state,action){
            if(state.rememberme){
                localStorage.setItem(state.name,JSON.stringify(action.payload));
            }
            sessionStorage.setItem(state.name,JSON.stringify(action.payload));
            state.authstatus = true;
        },
        isloggedin(state){
            const {name} = state;
            let pname, tname;
            pname = localStorage.getItem(name);
            tname = sessionStorage.getItem(name);
            if(!pname && !tname){
                state.authstatus = false;
            }else if(pname && !tname){
                sessionStorage.setItem(name,pname);
                state.authstatus = true;
            }else{
                state.authstatus = true;
            }
        },
        getuserData(state, payload){
            // let data = sessionStorage.getItem(state.name);
            // if(data){
            //         data = JSON.parse(data);
            //         return { ...state, ...data };;
            //     }
            //     return false;
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

export const { getuserData, logIn, change_token_memory, logOut, isloggedin } = authSlice.actions;

export default authSlice.reducer;