import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  analyzing: false,
  error: null,
};

const atsSlice = createSlice({
  name: 'ats',
  initialState,
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
    },
    setCurrentReport(state, action) {
      state.currentReport = action.payload;
    },
    addReport(state, action) {
      state.reports.unshift(action.payload);
    },
    setAnalyzing(state, action) {
      state.analyzing = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearCurrentReport(state) {
      state.currentReport = null;
    },
  },
});

export const {
  setReports, setCurrentReport, addReport,
  setAnalyzing, setLoading, setError, clearCurrentReport,
} = atsSlice.actions;

export const selectATSReports = (state) => state.ats.reports;
export const selectCurrentReport = (state) => state.ats.currentReport;
export const selectATSAnalyzing = (state) => state.ats.analyzing;

export default atsSlice.reducer;
