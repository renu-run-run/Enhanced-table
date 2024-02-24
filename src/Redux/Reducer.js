// Modify reducers.js
import { TOGGLE_COLUMN_VISIBILITY } from "./Action";

// Retrieve columnsVisibility state from localStorage, if available
const persistedColumnsVisibility = JSON.parse(localStorage.getItem("columnsVisibility"));

const initialState = {
  columnsVisibility: persistedColumnsVisibility || {
    photo: true,
    name: true,
    age: true,
    email: true,
    date: true,
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_COLUMN_VISIBILITY:
      const updatedColumnsVisibility = {
        ...state.columnsVisibility,
        [action.payload]: !state.columnsVisibility[action.payload],
      };
      // Save updated columnsVisibility state to localStorage
      localStorage.setItem("columnsVisibility", JSON.stringify(updatedColumnsVisibility));
      return {
        ...state,
        columnsVisibility: updatedColumnsVisibility,
      };
    default:
      return state;
  }
};

export default rootReducer;
