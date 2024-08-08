 import { configureStore } from '@reduxjs/toolkit';
 import scoreSlice from '../userScore/ScoreSlice';

 export default configureStore({
     reducer: {
         score: scoreSlice.reducer,
     },
 });


