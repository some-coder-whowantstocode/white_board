import axios from "axios";

const userServiceping =async()=>{
    try {
        const URL = import.meta.env.VITE_KEY_USER_PING;
        await axios.head(URL);
        return true;
    } catch (error) {
        return false;
    }
   

}


export {
    userServiceping
}