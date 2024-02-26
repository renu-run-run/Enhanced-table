// actions.js
export const TOGGLE_COLUMN_VISIBILITY = "TOGGLE_COLUMN_VISIBILITY";
export const SET_AGE_RANGE_FILTER = "SET_AGE_RANGE_FILTER";
export const CLEAR_AGE_RANGE_FILTER = "CLEAR_AGE_RANGE_FILTER";

export const clearAgeRangeFilter = () => ({
  type: CLEAR_AGE_RANGE_FILTER,
});

export const toggleColumnVisibility = (column) => ({
  type: TOGGLE_COLUMN_VISIBILITY,
  payload: column,
});
export const setAgeRangeFilter = (minAge, maxAge) => ({
  type: SET_AGE_RANGE_FILTER,
  payload: { minAge, maxAge },
});