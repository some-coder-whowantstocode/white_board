import { configureStore } from '@reduxjs/toolkit'
import cursorReducer from './features/canvas/slices/cursorSlice'
import canvasReducer from './features/canvas/slices/canvasSlice'
import shapeReducer from './features/canvas/slices/shapesSlice'

export default configureStore({
  reducer: {
    cursor:cursorReducer,
    canvas:canvasReducer,
    shape:shapeReducer
  },
}) 