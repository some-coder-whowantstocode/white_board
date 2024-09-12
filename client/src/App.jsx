import './App.css'
import Canvas from './pages/Canvas.jsx';
import Controller from './features/canvas/components/Controller.jsx'
import { CanvasProvider } from './features/canvas/context/canvasProvider.jsx';
import Filespace from './pages/Filespace.jsx';
import { FileProvider } from './features/filesystem/context/FileContext.jsx';
import { AuthProvider } from './features/authentication/context/authContext.jsx';
import {
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';
import {pagelocation} from './assets/pagesheet.js';
import Auth from './pages/Auth.jsx';
import User from './pages/User.jsx';
import { useEffect } from 'react';
import Notverified from './pages/error pages/Notverified.jsx';
import Verify from './pages/Verify.jsx';
import NotFound from './pages/error pages/NotFound.jsx';
import InvalidParameter from './pages/error pages/InvalidParameter.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Resetpassword from './pages/Resetpassword.jsx';

export const history = {
  navigater:null,
  navigate:(path)=>{
      if (history.navigater) {
          history.navigater(path);
      } else {
        window.location.href = path;
          console.error("Navigator is not set");
      }
  },
  goback:()=>{
    if (history.navigater) {
      history.navigater(-1);
  } else {
    window.history.back();
      console.error("Navigator is not set");
  }
  },
  reload:()=>{
    window.location.reload();
  }
};  


function App() {
    const nav = useNavigate();
    useEffect(()=>{
      history.navigater = nav;
    },[nav])
  return (
      <Routes >
    
      <Route 
      
      path={pagelocation.canvas}  
      element={ 
      <CanvasProvider>
        <Canvas/>
        <Controller/>
      </CanvasProvider>}
      >
      </Route>

      <Route 
      path={`/${pagelocation.filespace}`} 
      element={
          <FileProvider>
            <Filespace/>
          </FileProvider>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.auth}`} 
      element={
        <AuthProvider>
          <Auth/>
        </AuthProvider>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.user}`} 
      element={
          <User/>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.notverified}`} 
      element={
          <Notverified/>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.verify}`} 
      element={
          <Verify/>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.notfound}`} 
      element={
          <NotFound/>
      }>
      </Route>
      <Route 
      path={`/${pagelocation.invalidparam}`} 
      element={
          <InvalidParameter/>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.forgotpass}`} 
      element={
          <ForgotPassword/>
      }>
      </Route>

      <Route 
      path={`/${pagelocation.resetpass}`} 
      element={
          <Resetpassword/>
      }>
      </Route>

      </Routes>
  )
}

export default App
