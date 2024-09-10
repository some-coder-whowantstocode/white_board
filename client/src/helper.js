import { useNavigate } from 'react-router-dom';
import { addpopup } from './features/popup/slices/popupSlice';
import store from './store'
import { pagelocation } from './assets/pagesheet';
import { createBrowserHistory } from 'history';
import { logOut } from './features/authentication/slices/authSlice';
import { history } from './App';



export const handler =(code,msg)=>{
    console.log(code,msg)
    switch(code){
        case 200 :
            store.dispatch(addpopup({msg:msg || "Successfully exicuted", type:0}));
        break;
        case 500 :
            store.dispatch(addpopup({msg:msg || "Something went wrong please try again", type:1}));
        break;
        case 400 :
            store.dispatch(addpopup({msg:msg || "Invalid credentials.", type:1}));
        break;
        case 408 :
            store.dispatch(addpopup({msg: "Oops, request timeout!", type:1}));
        break;
        case 401 :
            store.dispatch(addpopup({msg:msg || "Unathourized access!", type:1}));
            store.dispatch(logOut());
            history.navigate(pagelocation.auth);
        break;
        default :
        store.dispatch(addpopup({msg:msg || "Network error!", type:1}));
        break;
    }
}