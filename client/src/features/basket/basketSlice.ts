import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Basket from "../../app/models/basket";
import { requests } from "../../app/api/agent";
import { RootState } from "../../app/store";

interface BasketState {
    status: 'loading' | 'idle',
    basket: Basket | null;
    loaded: boolean;
    context?: {
        productId: number;
    }
}

const initialState: BasketState = {
    status: 'idle',
    basket: null,
    loaded: false
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

export const addBasketItem = createAsyncThunk<Basket, { productId: number, quantity: number }, { state: RootState }>(
    'addBasketItem',
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const { data, errors } = await requests.basket.add(productId, quantity);
            if (errors) throw errors;
            return data!.addBasketItem;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({ error: e.toString() });
        }
    }
)

export const removeBasketItem = createAsyncThunk<Basket, number, { state: RootState }>(
    'removeBasketItem',
    async (productId, thunkAPI) => {
        try {
            const { data, errors } = await requests.basket.remove(productId);
            if (errors) throw errors;
            return data!.removeBasketItem;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({ error: e.toString() })
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        clearBasket: (state) => {
            state.basket = null;
        },

        setBasket: (state, action: PayloadAction<Basket>) => {
            state.basket = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBasket.pending, (state, action) => {
            state.status = 'loading'
        })

        builder.addCase(fetchBasket.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.loaded = true;
            state.status = 'idle';
        })

        builder.addCase(fetchBasket.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        })

        builder.addCase(addBasketItem.pending, (state, action) => {
            state.status = 'loading';
            state.context = { productId: action.meta.arg.productId };
        })

        builder.addCase(addBasketItem.fulfilled, (state, action) => {
            state.status = 'idle';
            state.context = undefined;
            state.basket = action.payload;
        })


        builder.addCase(addBasketItem.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload)
            state.context = undefined;
        })

        builder.addCase(removeBasketItem.pending, (state, action) => {
            state.status = 'loading';
            state.context = { productId: action.meta.arg };
        })

        builder.addCase(removeBasketItem.fulfilled, (state, action) => {
            state.status = 'idle';
            state.context = undefined;
            state.basket = action.payload;
        })


        builder.addCase(removeBasketItem.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload)
            state.context = undefined;
        })
    }
})

export const { clearBasket, setBasket } = basketSlice.actions;