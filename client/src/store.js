import { configureStore } from '@reduxjs/toolkit'

import processReducer from './features/processes/slices/processSlice'
import cursorReducer from './features/canvas/slices/cursorSlice'
import canvasReducer from './features/canvas/slices/canvasSlice'
import popupReducer from './features/popup/slices/popupSlice'
import shapeReducer from './features/canvas/slices/shapesSlice'
import authReducer from './features/authentication/slices/authSlice'

export default configureStore({
  reducer: {
    process:processReducer,
    canvas:canvasReducer,
    cursor:cursorReducer,
    popup:popupReducer,
    shape:shapeReducer,
    auth:authReducer
  },
}) 