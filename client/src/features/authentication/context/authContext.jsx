import { createContext, useContext } from "react";

const authContext = createContext(null);

export const AuthProvider =({children})=>{

    const isauthenticated =()=>{
        
    }

    return(
        <authContext.Provider value={{  }}>
        {children}
        </authContext.Provider>
    )
}

export const useauth =()=>{
    return useContext(authContext);
}