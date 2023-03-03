import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Category, Language } from "../../app/models/filters";
import { SearchParams, SortingOptions, requests } from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { PaginatedProductSchema } from "../../app/api/schema";
import { RootState } from "../../app/store";
import _ from "lodash";

interface Pagination {
    currentPage: number;
    totalPages: number;
    itemCount: number;
    itemsPerPage: number;
}

interface Filters {
    categories: Category[];
    languages: Language[];
}

interface FilterState extends Filters {
    status: 'idle' | 'loading';
    loaded: boolean;
}

interface CatalogState {
    filters: FilterState;
    status: 'idle' | 'loading' | 'products-loading';
    loaded: boolean;
    pagination: Pagination;
    productParams: SearchParams;
}

const initialState: CatalogState = {
    filters: {
        categories: [],
        languages: [],
        loaded: false,
        status: 'idle'
    },

    status: 'idle',
    loaded: false,
    pagination: {
        currentPage: -1,
        itemCount: 0,
        totalPages: 0,
        itemsPerPage: 20
    },
    productParams: {
        page: 1,
        itemsPerPage: 20,
        sortBy: 'RELEVANCE'
    }
}

const productAdapter = createEntityAdapter<Product>();

export const fetchFilters = createAsyncThunk<Filters, void, { state: RootState }>(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            const { data } = await requests.catalog.fetchFilters();
            return data;
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue({ error: "something went wrong" })
        }
    },
    {
        condition: (arg, { getState }) => {
            const { catalog } = getState();
            return !catalog.filters.loaded;
        }
    }
)

export const fetchProducts = createAsyncThunk<PaginatedProductSchema, void, { state: RootState }>(
    'catalog/fetchProducts',
    async (_, thunkAPI) => {
        try {
            const { catalog } = thunkAPI.getState()
            const { data } = await requests.catalog.fetchProducts(catalog.productParams);
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
    reducers: {
        setProductParams: (state, action) => {
            const prevProductParams = state.productParams;
            state.productParams = { ...state.productParams, ...action.payload };

            if (_.isEqual(prevProductParams, state.productParams) === false) {
                state.loaded = false;
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchFilters.pending, (state, action) => {
            state.filters.status = 'loading';
        })

        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.filters.status = 'idle';
            state.filters.loaded = true;
        });

        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.filters.status = 'idle';
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

export const { setProductParams } = catalogSlice.actions; 