import { createContext, useContext, useState } from "react";

const authContext = createContext(null);

export const AuthProvider =({children})=>{

    const [ show, setshow ] = useState('signin');

    const AUTHDATA = [
        {
            head:'Sign In',
            otherways:["Go","fa","Gi","in"],
            instruction:'or use your email password',
            inputs:['email','password'],
            btntext:'SIGN IN',
            name:'signin',
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