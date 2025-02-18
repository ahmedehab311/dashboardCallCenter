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

const loadUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        return {
          admin: parsedUserData || null,
          tokenType: "Bearer",
        };
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }
  return null;
};

const initialState = {
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
      return rejectWithValue(
        error.response?.data?.messages || "An unexpected error occurred"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.admin = action.payload.user;
      state.token = action.payload.token;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        // عند نجاح الـ login، يتم تحديث بيانات المستخدم
        state.admin = action.payload.user;
        state.token = action.payload.token;
        state.messages = []; // نعيد تعيين الرسائل لأن الدخول كان ناجح
      })
      .addCase(loginUser.rejected, (state, action) => {
        // في حالة الفشل، سيتم تخزين الرسائل
        state.error = action.payload || "Login failed";
        state.messages = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
