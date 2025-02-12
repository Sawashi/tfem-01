import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  isPublic: boolean | null;
  teacherIds: string[] | null;
  type: string | null;
}

interface SortState {
  columnKey: string | undefined;
  order: string | undefined;
  field: string | undefined;
}

interface ReviewManagementState {
  imageUrl: string;
  filter: FilterState;
  sort: SortState;
  disabledReset: boolean;
}

const initialState: ReviewManagementState = {
  imageUrl: "",
  filter: {
    isPublic: null,
    teacherIds: null,
    type: null,
  },
  sort: {
    columnKey: undefined,
    order: undefined,
    field: undefined,
  },
  disabledReset: true,
};

const isStateEqualToInitialState = (state: ReviewManagementState): boolean => {
  return (
    JSON.stringify(state.filter) === JSON.stringify(initialState.filter) &&
    JSON.stringify(state.sort) === JSON.stringify(initialState.sort)
  );
};

export const reviewManagementSlice = createSlice({
  name: "reviewManagementSlice",
  initialState,
  reducers: {
    resetFilterAndSortInhouse: (state) => {
      state.filter = {
        isPublic: null,
        teacherIds: null,
        type: null,
        // isActive?
      };
      state.sort = {
        columnKey: undefined,
        order: undefined,
        field: undefined,
      };
      state.disabledReset = true;
    },
    setFilter: (state, action: PayloadAction<FilterState>) => {
      state.filter = action.payload;
      state.disabledReset = isStateEqualToInitialState(state);
    },
    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
      state.disabledReset = isStateEqualToInitialState(state);
    },
    setImageURL: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
    setDisabledReset: (state, action: PayloadAction<boolean>) => {
      state.disabledReset = action.payload;
    },
  },
});

export const { setFilter, setSort, resetFilterAndSortInhouse, setImageURL } =
  reviewManagementSlice.actions;
export const selectDisabledResetReview = (state: {
  reviewManagement: ReviewManagementState;
}) => state.reviewManagement.disabledReset;
export default reviewManagementSlice.reducer;
