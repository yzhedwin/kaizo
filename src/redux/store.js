import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from '../components/slicers/authSlice'

export default configureStore({
    reducer: {
        auth: AuthReducer,
      },
})