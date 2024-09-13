import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import store from './store.js'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Errorboundary } from './Errorboundary/errorboundry.jsx'
import { AuthProvider } from './features/authentication/context/authContext.jsx'
import { FileProvider } from './features/filesystem/context/FileContext.jsx'
import { CanvasProvider } from './features/canvas/context/canvasProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
      <Provider store={store}>
            <Errorboundary>
                  <Router>
                        <AuthProvider>
                              <CanvasProvider>
                                    <FileProvider>
                                          <App/>
                                    </FileProvider>
                              </CanvasProvider>
                        </AuthProvider>
                  </Router>
            </Errorboundary>
      </Provider>
     
)
