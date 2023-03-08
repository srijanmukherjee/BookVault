import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Basket from "../../app/models/basket";
import { requests } from "../../app/api/agent";

interface BasketState {
    status: 'loading' | 'idle',
    basket: Basket | null;
}

const initialState: BasketState = {
    status: 'idle',
    basket: null
};

export const fetchBasket = createAsyncThunk(
    'fetchBasket',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await requests.basket.fetch();
            if (error) throw error;
            return data.basket;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({ error: e.toString() });
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBasket.pending, (state, action) => {
            state.status = 'loading'
        })

        builder.addCase(fetchBasket.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        })

        builder.addCase(fetchBasket.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        })
    }
})