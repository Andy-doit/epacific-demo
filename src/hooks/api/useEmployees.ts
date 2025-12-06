import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { employeeService } from '@/services/employee.service';
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from '@/types/employee.types';
import { toast } from 'sonner';

const EMPLOYEES_QUERY_KEY = ['employees'] as const;

/**
 * Hook to fetch all employees
 */
export const useEmployees = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: () => employeeService.getEmployees(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

/**
 * Hook to create a new employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      employeeService.createEmployee(payload),
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success('Employee created successfully', {
        description: 'The new employee has been added to the list.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create employee', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
};

/**
 * Hook to update an employee
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeeService.updateEmployee(id, payload),
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success('Employee updated successfully', {
        description: 'The employee information has been updated.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update employee', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
};

/**
 * Hook to delete an employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success('Employee deleted successfully', {
        description: 'The employee has been removed from the list.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete employee', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
};

