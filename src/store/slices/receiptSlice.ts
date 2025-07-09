import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { receiptAPI } from '../../services/api';
import { Product } from './productsSlice';

export interface ReceiptData {
  _id?: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  code: string;
  gstin: string;
  accessories: boolean;
  paymentType: string;
  specialDiscount: number;
  items: Array<{
    product: Product;
      model: {
        name: string;
        accessoryCharge: number;
      };
      battery: {
        name: string;
        capacity: string;
      };
      range: number;
      rate: number;
      quantity: number;
      amount: number;
      color: string;
      hsnCode: string;
      batteryNumber: string;
      chargerNumber: string;
      chassisNumber: string;
  }>;
  subtotal: number;
  accessoryCharges: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  receiptNumber: string;
  date: string;
  finalAmount: number;
}

export interface ReceiptFilters {
  fromDate?: string;
  toDate?: string;
  chassisNo?: string;
  receiptNumber?: string;
  phone?: string;
  state?: string;
  code?: string;
  gstin?: string;
}

interface ReceiptState {
  currentReceipt: ReceiptData | null;
  receipts: ReceiptData[];
  filteredReceipts: ReceiptData[];
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptState = {
  currentReceipt: null,
  receipts: [],
  filteredReceipts: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const generateReceipt = createAsyncThunk(
  'receipt/generateReceipt',
  async (receiptData: Omit<ReceiptData, 'id'>, { rejectWithValue }) => {
    try {
      const response = await receiptAPI.generateReceipt(receiptData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate receipt');
    }
  }
);

export const fetchReceipts = createAsyncThunk(
  'receipt/fetchReceipts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await receiptAPI.getReceipts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch receipts');
    }
  }
);

export const searchReceipts = createAsyncThunk(
  'receipt/searchReceipts',
  async (filters: ReceiptFilters, { rejectWithValue }) => {
    try {
      const response = await receiptAPI.searchReceipts(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search receipts');
    }
  }
);

export const fetchReceiptById = createAsyncThunk(
  'receipt/fetchReceiptById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await receiptAPI.getReceiptById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch receipt');
    }
  }
);

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    setCurrentReceipt: (state, action: PayloadAction<ReceiptData>) => {
      state.currentReceipt = action.payload;
    },
    clearCurrentReceipt: (state) => {
      state.currentReceipt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilteredReceipts: (state) => {
      state.filteredReceipts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Receipt
      .addCase(generateReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceipt = action.payload;
        state.receipts.push(action.payload);
      })
      .addCase(generateReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Receipts
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Receipts
      .addCase(searchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredReceipts = action.payload;
      })
      .addCase(searchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Receipt by ID
      .addCase(fetchReceiptById.fulfilled, (state, action) => {
        state.currentReceipt = action.payload;
      });
  },
});

export const { 
  setCurrentReceipt, 
  clearCurrentReceipt, 
  clearError, 
  clearFilteredReceipts 
} = receiptSlice.actions;
export default receiptSlice.reducer;