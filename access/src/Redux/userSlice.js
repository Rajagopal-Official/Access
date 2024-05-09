import { createSlice } from '@reduxjs/toolkit';

const initialState = {//Defining Initial State 
  userName: '',
  password: '',
  accessKey: '',
  isLoggedIn:localStorage.getItem('isLoggedIn')==='true'//Retrive login status from local storage
};

const userSlice = createSlice({//Creating a Slice
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setAccessKey: (state, action) => {
      state.accessKey = action.payload;
    },
    clearUser: (state) => {
      state.userName = '';
      state.password = '';
      state.accessKey = '';
    },
  },
});
export const { setUserName, setPassword, setAccessKey, clearUser } = userSlice.actions;
export default userSlice.reducer;