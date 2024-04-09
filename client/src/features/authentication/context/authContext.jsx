import { createContext, useContext, useState } from "react";

const authContext = createContext(null);

export const AuthProvider =({children})=>{

    const [ show, setshow ] = useState('login');
    

    const isauthenticated =()=>{
        // i will send for login then i will store the token in server side and make a custom token using clients id and user agent then return it to client if it matches the client then i will allow user to access i will not send the token to user
        
    }

    const AUTHDATA = [
        {
            head:'Sign In',
            otherways:["Go","fa","Gi","in"],
            instruction:'or use your email password',
            inputs:['email','password'],
            btntext:'SIGN IN',
            name:'login',
            alternative:{
                head:'Hello Friend!',
                instruction:'Register with your personal details to use all of site features'
            }
        },
        {
            head:'Create Account',
            otherways:["Go","fa","Gi","in"],
            instruction:'or use your email for registration',
            inputs:['name','email','password'],
            btntext:'SIGN UP',
            name:"signup",
            alternative:{
                head:'Welcome Back!',
                instruction:'Enter your registerd details to use all of the features'
            }
        }
    ]

    return(
        <authContext.Provider value={{ AUTHDATA, show, setshow }}>
        {children}
        </authContext.Provider>
    )
}

export const useauth =()=>{
    return useContext(authContext);
}