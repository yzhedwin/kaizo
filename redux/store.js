import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from '../components/auth/authSlice'

export default configureStore({
    reducer: {
        auth: AuthReducer,
      },
})