import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/api/axiosInstance";

export const fetchSections = createAsyncThunk(
  "sections/fetchSections",
  async (_, thunkAPI) => {
    try {
      const response = await apiInstance.get("/panel/sections");
      if (process.env.NODE_ENV === "development") {
        console.log("fetchSection", response.data.response.data);
      }

      return response.data.response.data;
    } catch (error) {
      console.error("fetchSections Error:", error);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchSectionDetails = createAsyncThunk(
  "sections/fetchSectionDetails",
  async (sectionId, thunkAPI) => {
    try {
      const response = await apiInstance.get(`/panel/sections/${sectionId}`);
      console.log("Section Details Response:", response.data.response.data[0]);
      return response.data.response.data[0];
    } catch (error) {
      console.error("fetchSectionDetails Error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSection = createAsyncThunk(
  "sections/addSection",
  async (section, thunkAPI) => {
    try {
      const response = await apiInstance.post("/panel/sections", section);
      const responseData = response.data;
      if (responseData.messages) {
        return responseData;
      } else {
        return { messages: ["Section added successfully."] };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.messages?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred";

      return thunkAPI.rejectWithValue({ messages: [errorMessage] });
    }
  }
);
export const deleteSection = createAsyncThunk(
  "sections/deleteSection",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/panel/sections/${id}`);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    sections: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Sections
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.sectionData = action.payload;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Section
    builder
      .addCase(addSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })
      .addCase(addSection.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete Section
    builder
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(
          (section) => section.id !== action.payload
        );
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default sectionsSlice.reducer;

// export const deleteSection = createAsyncThunk(
//   "sections/deleteSection",
//   async (id, thunkAPI) => {
//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to delete section");
//       }
//       return id;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// Slice
