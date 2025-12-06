export interface Employee {
  id: string;
  employee: string;
  email: string;
  phone: string;
  Position: string;
  Department: string;
  Status: string;
}

export interface CreateEmployeePayload {
  employee: string;
  email: string;
  phone: string;
  Position: string;
  Department: string;
  Status: string;
}

export interface UpdateEmployeePayload {
  employee?: string;
  email?: string;
  phone?: string;
  Position?: string;
  Department?: string;
  Status?: string;
}

