import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, modelsAPI, batteriesAPI } from '../../services/api';

export interface Product {
  _id: string;
  model: Model;
  battery: Battery;
  range: number;
  rate: number;
  availableQuantity: number;
}

export interface Model {
  _id: string;
  name: string;
  accessoryCharge: number;
}

export interface Battery {
  _id: string;
  name: string;
  capacity: string;
}

interface ProductsState {
  products: Product[];
  models: Model[];
  batteries: Battery[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  models: [],
  batteries: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchModels = createAsyncThunk(
  'products/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.getModels();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch models');
    }
  }
);

export const fetchBatteries = createAsyncThunk(
  'products/fetchBatteries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await batteriesAPI.getBatteries();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batteries');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Omit<Product, 'id'>, { rejectWithValue, dispatch }) => {
    try {
      const response = await productsAPI.addProduct(productData);
      // Refresh products list to get the latest data
      dispatch(fetchProducts());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.updateProduct(id, productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const createModel = createAsyncThunk(
  'products/createModel',
  async (modelData: Omit<Model, 'id'>, { rejectWithValue, dispatch }) => {
    try {
      const response = await modelsAPI.addModel(modelData);
      // Refresh models list to get the latest data
      dispatch(fetchModels());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create model');
    }
  }
);

export const createBattery = createAsyncThunk(
  'products/createBattery',
  async (batteryData: Omit<Battery, 'id'>, { rejectWithValue, dispatch }) => {
    try {
      const response = await batteriesAPI.addBattery(batteryData);
      // Refresh batteries list to get the latest data
      dispatch(fetchBatteries());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create battery');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await productsAPI.deleteProduct(id);
      // Refresh products list to get the latest data
      dispatch(fetchProducts());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Models
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Batteries
      .addCase(fetchBatteries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatteries.fulfilled, (state, action) => {
        state.loading = false;
        state.batteries = action.payload;
      })
      .addCase(fetchBatteries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update Product
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Create Model
      .addCase(createModel.fulfilled, (state, action) => {
        state.models.push(action.payload);
      })
      // Create Battery
      .addCase(createBattery.fulfilled, (state, action) => {
        state.batteries.push(action.payload);
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;