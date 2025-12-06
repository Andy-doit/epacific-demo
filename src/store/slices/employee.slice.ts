import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Employee } from '@/types/employee.types';

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
}

const initialState: EmployeeState = {
  employees: [],
  isLoading: false,
  error: null,
  selectedEmployee: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
      state.error = null;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(
        (emp) => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearEmployees: (state) => {
      state.employees = [];
      state.selectedEmployee = null;
      state.error = null;
    },
  },
});

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  removeEmployee,
  setSelectedEmployee,
  setLoading,
  setError,
  clearEmployees,
} = employeeSlice.actions;

export default employeeSlice.reducer;

