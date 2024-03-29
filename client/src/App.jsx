import './App.css'
import { IconBox } from './assets/icons.js';
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
import {pagelocation} from './pages/pagesheet.js';

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

      </Routes>
    </Router>
  )
}

export default App
