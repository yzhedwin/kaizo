import { createSlice } from '@reduxjs/toolkit'

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isSignIn: false,
    userToken: null,
    userData: null
  },
  reducers: {
    signIn(state, data) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isSignIn = true;
      state.userData = data.payload.data;
      state.userToken = data.payload.token;
    },
    signOut: state => {
      state.isSignIn = false;
      state.userData = null;
      state.userToken = null;
    },
  }
})

export const { signIn, signOut } = AuthSlice.actions
export const selectUserData = state => state.auth.userData
export default AuthSlice.reducer