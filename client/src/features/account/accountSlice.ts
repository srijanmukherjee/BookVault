import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { LoggedInUserSchema } from "../../app/api/schema";
import { LOCAL_STORAGE_AUTH_KEY, requests } from "../../app/api/agent";
import { ApolloError } from "@apollo/client";

interface AccountState {
    token?: string;
    user?: Partial<User>;
    status: "idle" | "loading";
    errors: any[];
    fetchingCurrentUser: boolean;
}

const initialState: AccountState = {
    status: 'idle',
    errors: [],
    fetchingCurrentUser: false
}

function parseServerError(error: any) {
    if (error instanceof ApolloError && error.graphQLErrors.length == 1) {
        const fieldErrors: any = error.graphQLErrors[0].extensions?.errors;
        if (fieldErrors) return fieldErrors;
    }

    console.error(error);
    return "Something went wrong";
}

export const login = createAsyncThunk<LoggedInUserSchema, { email?: string, password?: string }>(
    'login',
    async ({ email, password }, thunkAPI) => {
        try {
            const { data, error } = await requests.account.login(email, password);
            if (error) throw error;
            return data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({ error: parseServerError(e) });
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<LoggedInUserSchema>(
    'fetchCurrentUser',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await requests.account.login();
            if (error) throw error;
            return data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({ error: parseServerError(e) });
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(login.pending, (state, action) => {
            state.status = 'loading'
        })

        builder.addCase(fetchCurrentUser.pending, (state, action) => {
            state.status = 'loading'
            state.fetchingCurrentUser = true;
        })

        builder.addCase(login.fulfilled, (state, action) => {
            state.status = 'idle'
            const { token, ...user } = action.payload.login;
            localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, token);
            state.token = token;
            state.user = user;
        })

        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.status = 'idle'
            const { token, ...user } = action.payload.login;
            localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, token);
            state.token = token;
            state.user = user;
            state.fetchingCurrentUser = false;
        })

        builder.addCase(login.rejected, (state, action) => {
            state.status = 'idle'
            localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
            state.user = undefined;
        })

        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.status = 'idle'
            state.fetchingCurrentUser = false;
            localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
            state.user = undefined;
        })
    },
});