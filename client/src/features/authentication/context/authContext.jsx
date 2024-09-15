import { createContext, useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popexternalProcess, pushexternalProcess } from "../../processes/slices/processSlice";
import axios from "axios";
import { userServiceping } from "../../../helper/ping";
import { handler } from "../../../helper/handler";
import { updateping } from "../slices/authSlice";

const authContext = createContext(null);


export const AuthProvider =({children})=>{

    const [ show, setshow ] = useState('signin');
    const EXTERNAL_PROCESS = useSelector(state=>state.process.externalProcesses);
    const AUTH = useSelector(state=>state.auth)
    
    const inputdata = useRef({
        signin:{email:'', password:''},
        signup:{name:'', email:'', password:''}}
    );
    
    const dispatch = useDispatch();

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

    const Tests = {
        password:[
        {sample: /^(?=.*[a-z]).*$/, err: "The password must contain at least one small letter."},
        {sample: /^(?=.*[A-Z]).*$/, err: "The password must contain at least one capital letter."},
        {sample: /^(?=.*[0-9]).*$/, err: "The password must contain at least one number."},
        {sample: /^(?=.*[!@#$%^&*]).*$/, err: "The password must contain at least one symbol."},
        {sample: /^.{6,12}$/, err: "The password length must be between 6 to 12 characters."}
    ],
    email:[
        {sample: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, err:"Please provide a valid email."}
    ],
    name:[
        {sample: /^.{4,14}$/, err: "The name length must be between 6 to 12 characters."}
    ]
    }

    const verify =async(keys,values)=>{
        try{
            if(Array.isArray(keys) && Array.isArray(values)){
                for(let i=0;i<keys.length;i++){
                    const tests = Tests[keys[i]];
                    for(let j=0;j<tests.length;j++){
                        if(!tests[j].sample.test(values[i])){
                            handler(500,tests[j].err);
                            return false;
                        }
                    }
                }
            }
            
            if(AUTH.pingTime){
                let currtime = new Date().getTime();
                if((AUTH.pingTime - currtime) < AUTH.pingDuration){
                    return true;
                }
            }
            
            const working = await userServiceping();
            if(!working){
                handler(500,"Due to free hosting server is inactive right now  it will take some time to work please try again later.")
                return false;
            }
            dispatch(updateping());
            return true;
        }catch(err){
            console.log(err);
        }
        
    }

    const signIn =async()=>{
        if(EXTERNAL_PROCESS){
            handler(500, "please wait patiently one request is being processed");
            return;
            }
        dispatch(pushexternalProcess({msg:"singing in..."}))
        const { email, password } = inputdata.current.signin;
        let verified =await verify(['email','password'],[email,password]);
        if(verified ){
            try{
                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_LOGIN}`;
                const headers = {}
                const body = {...inputdata.current[show],persist:AUTH.rememberme}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                const {user} = data;
                if(!user.verified){
                    history.navigate(pagelocation.notverified);
                    return;
                }
                    dispatch(logIn({name:user.name,email:user.email}));
                    history.navigate(pagelocation.user)
                    handler(200,"successfully loggedin.")
            
            }catch(err){
                console.log(err)
                handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
            }finally{
                dispatch(popexternalProcess())
            }
        }
    }

    const signUp =async()=>{
        if(EXTERNAL_PROCESS){
            handler(500, "please wait patiently one request is being processed");
            return;
            }
        dispatch(pushexternalProcess({msg:"signing up..."}))
        const {name, email, password} = inputdata.current.signup
        let verified =await verify(['name','email','password'],[name,email,password]);
        if(verified){
            try{

                const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_REGISTER}`;
                const headers = {}
                const body = {...inputdata.current[show]}
                const {data} = await axios.post(URL,body,{
                    headers: headers,
                    withCredentials: true 
                });
                handler(200,"successfully signed up.")
                    history.navigate(pagelocation.notverified);
            }catch(err){
                handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")

            }finally{
                dispatch(popexternalProcess())
            }
        }
    }

    const changepass = async(email)=>{
        try{
            if(EXTERNAL_PROCESS){
                handler(500, "please wait patiently one request is being processed");
                return;
                }
            dispatch(pushexternalProcess({msg:"singing in..."}))
            await verify();
            if(!email){
                handler(500,"please enter email.");
                return;
            }
            const emailTests = Tests.email;
            for (let i = 0; i < emailTests.length; i++) {
                if (!emailTests[i].sample.test(email)) {
                    handler(500,"please enter a valid email.");
                    return;
                }
            }
            const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_FORGOT_PASS}`;
            const body = {
                email
            };
            const headers = {}
            const {data} = await axios.post(URL, body, headers)
            handler(200,'Email has been sent to the given email please check your email to changepass.')
            history.navigate(pagelocation.canvas)
        }catch(err){
            handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
        }finally{
            dispatch(popexternalProcess())
        }
    }

    const resetpass = async(password,token)=>{
        try{
            if(EXTERNAL_PROCESS){
                handler(500, "please wait patiently one request is being processed");
                return;
                }
            dispatch(pushexternalProcess({msg:"singing in..."}))
            await verify();
            if(!password){
                handler(500,"please enter password.");
                return;
            }
            const passwordTests = Tests.password;
            for (let i = 0; i < passwordTests.length; i++) {
                if (!passwordTests[i].sample.test(password)) {
                    handler(500,"please enter a valid password.");
                break;
                }
            }
            
            const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_CHANGE_PASS}/${token}`;
            const body = {
                password
            };
            const headers = {}
            const {data} = await axios.post(URL, body, headers)
            handler(200,'password changed successfully')
            history.navigate(pagelocation.auth);
        }catch(err){
            console.log(err)
            handler(err.status ,err?.response?.data?.err || err?.message || "something went wrong.")
        }finally{
            dispatch(popexternalProcess())
        }
    }

    const verifycode = async (email,otp) => {
        try {
            if(EXTERNAL_PROCESS){
            handler(500, "please wait patiently one request is being processed");
            return;
            }
            dispatch(pushexternalProcess({ msg: "verifying user..." }));
            await verify();
            if(otp.length < lengthallowed){
            handler(500, "please provide the otp given to you.");
            return;
            }
            const URL = `${import.meta.env.VITE_KEY_GATEWAY}${import.meta.env.VITE_KEY_USERSERVICE}${import.meta.env.VITE_KEY_USER_VERIFY}`;
            const body = { email, otp };
            const headers = {};
            let {data} = await axios.post(URL, body, headers);
            const {user} = data;
            dispatch(logIn({name:user.name,email:user.email}));
            history.navigate(pagelocation.auth)
            handler(200,"verified user account.")
        } catch (err) {
          handler(err.status, err?.response?.data?.err || err?.message || "something went wrong.");
        } finally {
          dispatch(popexternalProcess());
        }
      };

    return(
        <authContext.Provider value={{ AUTHDATA, show, setshow, signIn, signUp, verify, Tests, inputdata, changepass, resetpass, verifycode }}>
        {children}
        </authContext.Provider>
    )
}

export const useauth =()=>{
    return useContext(authContext);
}