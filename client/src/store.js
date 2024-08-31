import { configureStore } from '@reduxjs/toolkit'

import cursorReducer from './features/canvas/slices/cursorSlice'
import canvasReducer from './features/canvas/slices/canvasSlice'
import shapeReducer from './features/canvas/slices/shapesSlice'
import popupReducer from './features/popup/slices/popupSlice'
import authReducer from './features/authentication/slices/authSlice'

export default configureStore({
  reducer: {
    cursor:cursorReducer,
    canvas:canvasReducer,
    shape:shapeReducer,
    popup:popupReducer,
    auth:authReducer
  },
}) 