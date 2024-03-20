import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';


const socketContext = createContext(null);

export const Socketprovider =({children})=>{

    const [Socket,setSocket] = useState(null);
    const [details,setdetails] = useState(null);


    useEffect(()=>{
        const socket = io(import.meta.env.VITE_SOCKET_URI,{
            transports: ['websocket']
        });
        setSocket(socket);
    },[])
    

    useEffect(()=>{
        if(Socket){

            const handlemessage =async(data)=>{
                if(data.result === 'created'){
                    setdetails({
                        name:data.name,
                        room:data.roomid
                    })
                }

                
            }

            Socket.addEventListener('message',handlemessage);

            return(()=>{
                Socket.removeEventListener('message',handlemessage);
            })
        }
    },[Socket])

    return(
        <socketContext.Provider value={{Socket,details}}>
            {children}
        </socketContext.Provider>
    )

}

export const useSocket = ()=>{
    return useContext(socketContext);
}