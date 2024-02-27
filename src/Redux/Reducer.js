
import { TOGGLE_COLUMN_VISIBILITY } from "./Action";
import { SET_AGE_RANGE_FILTER } from "./Action";
import { CLEAR_AGE_RANGE_FILTER } from "./Action";

const persistedColumnsVisibility = JSON.parse(localStorage.getItem("columnsVisibility"));

const initialState = {
  columnsVisibility: persistedColumnsVisibility || {
    photo: true,
    name: true,
    age: true,
    email: true,
    date: true,
  },
  ageRangeFilter: { minAge: 0, maxAge: 100 },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_COLUMN_VISIBILITY:
      const updatedColumnsVisibility = {
        ...state.columnsVisibility,
        [action.payload]: !state.columnsVisibility[action.payload],
      };
   
      localStorage.setItem("columnsVisibility", JSON.stringify(updatedColumnsVisibility));
      return {
        ...state,
        columnsVisibility: updatedColumnsVisibility,
      };
    case SET_AGE_RANGE_FILTER:
        return {
          ...state,
          ageRangeFilter: {
            minAge: action.payload.minAge,
            maxAge: action.payload.maxAge,
          },
        };
    case CLEAR_AGE_RANGE_FILTER:
        return {
          ...state,
          ageRangeFilter: { minAge: 0, maxAge: 100 }, 
        };
    default:
      return state;
  }
};

export default rootReducer;
