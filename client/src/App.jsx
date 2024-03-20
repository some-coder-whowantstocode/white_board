import './App.css'
import Canvas from './features/canvas/components/Canvas.jsx';
import Controller from './features/canvas/components/Controller.jsx'
import { CanvasProvider } from './features/canvas/context/canvasProvider.jsx';
import { IconProvider } from './features/canvas/context/iconContext.jsx';
import { useSocket } from './features/socket/context/socketProvider.jsx'

function App() {
  const {} = useSocket()
  return (
    <>
    <IconProvider>
    <CanvasProvider>
      <Canvas/>
      <Controller/>
    </CanvasProvider>
    </IconProvider>
    </>
  )
}

export default App
