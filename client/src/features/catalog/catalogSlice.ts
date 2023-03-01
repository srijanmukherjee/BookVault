import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Category } from "../../app/models/filters";
import { client, requests } from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { PaginatedProductSchema } from "../../app/api/schema";
import { RootState } from "../../app/store";

interface CategoryFilter {
    data: Category[];
    state: 'idle' | 'loading';
    loaded: boolean;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    itemCount: number;
    itemsPerPage: number;
}

interface CatalogState {
    filters: {
        categories: CategoryFilter
    },

    status: 'idle' | 'loading' | 'products-loading';
    loaded: boolean;
    pagination: Pagination;
}

const initialState: CatalogState = {
    filters: {
        categories: {
            data: [],
            state: 'idle',
            loaded: false,
        }
    },

    status: 'idle',
    loaded: false,
    pagination: {
        currentPage: -1,
        itemCount: 0,
        totalPages: 0,
        itemsPerPage: 20
    }
}

const productAdapter = createEntityAdapter<Product>();

export const fetchCategories = createAsyncThunk<Category[], void, { state: RootState }>(
    'catalog/filter/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const { data } = await requests.catalog.fetchCategories();
            return data.categories;
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue({ error: "something went wrong" })
        }
    },
    {
        condition: (arg, { getState }) => {
            const { catalog } = getState();
            return !catalog.filters.categories.loaded;
        }
    }
)

export const fetchProducts = createAsyncThunk<PaginatedProductSchema, void, { state: RootState }>(
    'catalog/fetchProducts',
    async (_, thunkAPI) => {
        try {
            const { data } = await requests.catalog.fetchProducts();
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.toString() });
        }
    },
    {
        condition: (arg, { getState }) => {
            const { catalog } = getState();
            return !catalog.loaded;
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState<CatalogState>(initialState),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCategories.pending, (state, action) => {
            state.filters.categories.state = 'loading';
        })

        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.filters.categories.data = action.payload;
            state.filters.categories.state = 'idle';
            state.filters.categories.loaded = true;
        });

        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.filters.categories.state = 'idle';
            console.log(action.payload);
        })

        builder.addCase(fetchProducts.pending, (state, action) => {
            state.status = 'products-loading';
        })

        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload.products.data);
            state.pagination.currentPage = action.payload.products.currentPage;
            state.pagination.totalPages = action.payload.products.totalPages;
            state.pagination.itemsPerPage = action.payload.products.itemsPerPage;
            state.pagination.itemCount = action.payload.products.itemCount;
            state.status = 'idle';
            state.loaded = true;
        })

        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'idle';
            console.error(action.payload);
        })
    }
})

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog)