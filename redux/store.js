import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from '../components/auth/AuthSlice'

export default configureStore({
    reducer: {
        auth: AuthReducer,
      },
})