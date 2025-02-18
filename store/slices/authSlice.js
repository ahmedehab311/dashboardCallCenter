// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   loginUser as loginUserService,
//   // logout as logoutService,
// } from "@/app/[lang]/(auth)/services/authService";

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ credentials, hashedString }, { rejectWithValue }) => {
//     try {
//       const userData = await loginUserService(credentials, hashedString);
//       return userData;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     admin: null,
//     roles: [],
//     permissions: [],
//     accessToken: null,
//     tokenType: null,
//     expiresIn: null,
//     loading: false,
//     error: null,
//     messages: [],
//   },
//   reducers: {
//     // logout: (state) => {
//     //   logoutService();
//     //   state.admin = null;
//     //   state.roles = [];
//     //   state.permissions = [];
//     //   state.accessToken = null;
//     //   state.messages = [];
//     // },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.messages = [];
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.admin = action.payload.admin;
//         state.roles = action.payload.roles;
//         state.permissions = action.payload.permissions;
//         state.accessToken = action.payload.accessToken;
//         state.tokenType = action.payload.tokenType;
//         state.expiresIn = action.payload.expiresIn;
//         state.messages = action.payload.messages || [];
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.messages = action.payload.messages || ["Login failed"];
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginUserService } from "@/app/[lang]/(auth)/services/authService";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// تحميل بيانات المستخدم من localStorage
const loadUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    // تأكد من أن الكود يعمل في المتصفح فقط
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      return {
        admin: JSON.parse(userData).admin,
        roles: JSON.parse(userData).roles,
        permissions: JSON.parse(userData).permissions,
        accessToken: accessToken,
        tokenType: "Bearer",
        expiresIn: null, 
      };
    }
  }
  return null;
};

const initialState = loadUserFromLocalStorage() || {
  admin: null,
  roles: [],
  permissions: [],
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  loading: false,
  error: null,
  messages: [],
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials }, { rejectWithValue }) => {
    try {
      const userData = await loginUserService(credentials);
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // يمكن إضافة Logout هنا عند الحاجة لإزالة البيانات من Redux و localStorage
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.roles = action.payload.roles;
        state.permissions = action.payload.permissions;
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.messages = action.payload.messages || [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages = action.payload.messages || ["Login failed"];
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
