import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userScore: 0,
    aiScore: 0,

}

export const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        userScore(state, action) {
            state.userScore = action.payload;
        },
        aiScore(state, action) {
            state.aiScore = action.payload;
        },
    }


})

export const { userScore, aiScore } = scoreSlice.actions;
export default scoreSlice.reducer;
