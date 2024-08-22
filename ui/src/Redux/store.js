import { configureStore } from '@reduxjs/toolkit';
import { DialogReducer } from './reducer';

export default configureStore({
    reducer: {
        DialogState: DialogReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});