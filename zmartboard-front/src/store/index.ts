import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import projectsReducer from './projects/projectsSlice'
import boardsReducer from './boards/boardsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    boards: boardsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch