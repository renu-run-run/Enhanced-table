// actions.js
export const TOGGLE_COLUMN_VISIBILITY = "TOGGLE_COLUMN_VISIBILITY";

export const toggleColumnVisibility = (column) => ({
  type: TOGGLE_COLUMN_VISIBILITY,
  payload: column,
});
