import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    score: 0,

}

export const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        userScore: (state) => {
            state.score += 1;
        },
        aiScore: (state) => {
            state.score += 1;
        },
    }


})

export const { userScore,aiScore} = scoreSlice.actions;
export default scoreSlice.reducer;