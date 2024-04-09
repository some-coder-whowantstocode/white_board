import './App.css'
import Canvas from './pages/Canvas.jsx';
import Controller from './features/canvas/components/Controller.jsx'
import { CanvasProvider } from './features/canvas/context/canvasProvider.jsx';
import Filespace from './pages/Filespace.jsx';
import { FileProvider } from './features/filesystem/context/FileContext.jsx';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import {pagelocation} from './assets/pagesheet.js';
import Auth from './pages/Auth.jsx';

function App() {

  return (
    <Router>
      <Routes>
    
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
        <Auth/>
      }>
      </Route>

      </Routes>
    </Router>
  )
}

export default App
