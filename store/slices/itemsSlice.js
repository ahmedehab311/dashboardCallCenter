import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/api/axiosInstance";

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, thunkAPI) => {
    try {
      const response = await apiInstance.get("/panel/items");
      if (process.env.NODE_ENV === "development") {
        console.log("fetchItems from store", response.data.response.data);
      }

      return response.data.response.data;
    } catch (error) {
      console.error("fetchItems Error from store:", error);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchItemDetails = createAsyncThunk(
  "item/fetchitemDetails",
  async (itemId, thunkAPI) => {
    try {
      const response = await apiInstance.get(`/panel/items/${itemId}`);
      console.log("item Details Response:", response.data.response.data[0]);
      return response.data.response.data[0];
    } catch (error) {
      console.error("fetchItemDetails Error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const addItems = createAsyncThunk(
  "items/addItems",
  async (item, thunkAPI) => {
    try {
      const response = await apiInstance.post("/panel/items", item);
      const responseData = response.data;
      if (responseData.messages) {
        return responseData;
      } else {
        return { messages: ["item added successfully."] };
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
export const editItem = createAsyncThunk(
  "items/editItem",
  async ({ itemId, data }, thunkAPI) => {
    try {
      const response = await apiInstance.put(`/panel/items/${itemId}`, data);
      console.log("Edit Item Response:", response.data.response.data);
      return response.data.response.data; // البيانات المحدثة
    } catch (error) {
      const errorMessage =
        error.response?.data?.messages?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred";

      console.error("editItem Error:", errorMessage);
      return thunkAPI.rejectWithValue({ messages: [errorMessage] });
    }
  }
);
// Slice

export const deleteItems = createAsyncThunk(
  "items/deleteitems",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/panel/items/${id}`);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const ItemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch items
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsData = action.payload;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add items
    builder
      .addCase(addItems.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addItems.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder
      .addCase(editItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editItem.fulfilled, (state, action) => {
        state.loading = false;
        // تحديث العنصر في القائمة المحلية
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.itemsData && state.itemsData.id === action.payload.id) {
          state.itemsData = action.payload; // تحديث التفاصيل إذا كانت قيد العرض
        }
      })
      .addCase(editItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete items
    builder
      .addCase(deleteItems.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteItems.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ItemsSlice.reducer;
