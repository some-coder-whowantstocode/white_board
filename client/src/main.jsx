import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import { Socketprovider } from './features/socket/context/socketProvider.jsx'
import { AuthProvider } from './features/authentication/context/authContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
      <AuthProvider>
            <App/>
      </AuthProvider>
)
