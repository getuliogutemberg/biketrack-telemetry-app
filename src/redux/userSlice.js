import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  token: '',
  password: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.username = action.payload.username
      state.token = action.payload.token
      state.password = action.payload.password
    },
    userLogout: (state) => {
      state.username = ''
      state.token = ''
      state.password = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer