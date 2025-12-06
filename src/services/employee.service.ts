import { apiClient } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from '@/types/employee.types';

export const employeeService = {
  /**
   * Get all employees
   * @returns Promise<Employee[]> - Array of employees
   */
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>(API_ENDPOINTS.EMPLOYEES.GET);
    return response.data;
  },

  /**
   * Create a new employee
   * @param payload - Employee data
   * @returns Promise<Employee> - Created employee
   */
  createEmployee: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const response = await apiClient.post<Employee>(
      API_ENDPOINTS.EMPLOYEES.CREATE,
      payload
    );
    return response.data;
  },

  /**
   * Update an employee
   * @param id - Employee ID
   * @param payload - Employee update data
   * @returns Promise<Employee> - Updated employee
   */
  updateEmployee: async (
    id: string,
    payload: UpdateEmployeePayload
  ): Promise<Employee> => {
    const response = await apiClient.put<Employee>(
      API_ENDPOINTS.EMPLOYEES.UPDATE(id),
      payload
    );
    return response.data;
  },

  /**
   * Delete an employee
   * @param id - Employee ID
   * @returns Promise<void>
   */
  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
  },
};

