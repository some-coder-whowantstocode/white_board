import { Component } from "react";
import { history } from "../App";
import { pagelocation } from "../assets/pagesheet";

export class Errorboundary extends Component{
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render(){
        if (this.state.hasError) {
            return (
            <div 
            style={{
                backgroundColor:"white",
                height:'100vh',
                width:'100vw',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                flexDirection:'column'
            }}
            >
                <h1>Something went wrong.</h1>
                <p>The URL you provided is malformed. Please check the URL and try again.</p>
                <div>
                    <button onClick={()=>history.reload()}>try again</button>
                    <button onClick={()=>{
                        history.navigate(pagelocation.auth)
                        history.reload();
                        }}>go back</button>
                </div>
            </div>
            );
        }
      
        return this.props.children; 
    }

}