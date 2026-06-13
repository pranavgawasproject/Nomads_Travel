// src/features/location/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formValues: {
    continent: "",
    country: "",
    location: "",
    category: "",
    count: "",
  },
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    clearFormValues: (state) => {
      state.formValues = initialState.formValues;
    },
  },
});

export const { setFormValues, clearFormValues } = locationSlice.actions;
export default locationSlice.reducer;
