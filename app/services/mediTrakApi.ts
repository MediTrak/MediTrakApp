import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    __v: number;
    confirmationTokenExpiry: string;
    confirmed: boolean;
    hospital: {
        name: string;
    };
    password: string;
    role: string;
}


export interface UserResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const mediTrakApi = createApi({
    reducerPath: 'mediTrakApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://meditrak.onrender.com',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token

            // console.log(token, 'token in services')

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
                headers.set('Content-Type', 'application/json')
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getMedication: builder.query({
            query: () => ({
                method: 'GET',
                url: '/api/medication', //url of API endpoint
                // headers: {
                //     'Content-Type': 'application/json',
                //     Authorization: `Bearer ${token}`
                // },
            }),
        }),

        login: builder.mutation<UserResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/api/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        protected: builder.mutation<{ message: string }, void>({
            query: () => 'protected',
        }),
    }),
})

export const {
    useGetMedicationQuery,
    useLoginMutation,
    useProtectedMutation
} = mediTrakApi