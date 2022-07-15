import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isSignIn: false,
    userToken: 'null'
  },
  reducers: {
    signIn: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isSignIn = true;
    },
    signOut: state => {
      state.isSignIn = false;
    },
  }
})

export const { signIn, signOut } = authSlice.actions

export default authSlice.reducer