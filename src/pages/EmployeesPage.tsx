import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Edit, Trash2, UserPlus, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/hooks/api/useEmployees";
import { useAppDispatch } from "@/store/hooks";
import { setEmployees, addEmployee, updateEmployee as updateEmployeeAction, removeEmployee } from "@/store/slices/employee.slice";
import { getInitials } from "@/utils/format";
import type { Employee } from "@/types/employee.types";

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { data: employees = [], isLoading, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    employee: "",
    email: "",
    phone: "",
    Position: "",
    Department: "",
    Status: "",
  });

  // Sync employees to Redux store
  useEffect(() => {
    if (employees.length > 0) {
      dispatch(setEmployees(employees));
    }
  }, [employees, dispatch]);

  // Memoize filtered employees to avoid recalculating on every render
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (employee) =>
        employee.employee.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.Position.toLowerCase().includes(query) ||
        employee.Department.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const handleOpenDialog = useCallback((employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        employee: employee.employee,
        email: employee.email,
        phone: employee.phone,
        Position: employee.Position,
        Department: employee.Department,
        Status: employee.Status,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        employee: "",
        email: "",
        phone: "",
        Position: "",
        Department: "",
        Status: "",
      });
    }
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({
      employee: "",
      email: "",
      phone: "",
      Position: "",
      Department: "",
      Status: "",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (editingEmployee) {
        // Update employee
        const updated = await updateEmployeeMutation.mutateAsync({
          id: editingEmployee.id,
          payload: formData,
        });
        dispatch(updateEmployeeAction(updated));
      } else {
        // Create new employee
        const newEmployee = await createEmployeeMutation.mutateAsync(formData);
        dispatch(addEmployee(newEmployee));
      }
      handleCloseDialog();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to save employee:', error);
    }
  }, [editingEmployee, formData, updateEmployeeMutation, createEmployeeMutation, dispatch]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployeeMutation.mutateAsync(id);
        dispatch(removeEmployee(id));
      } catch (error) {
        // Error is handled by the mutation hook
        console.error('Failed to delete employee:', error);
      }
    }
  }, [deleteEmployeeMutation, dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Failed to load employees</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Employee Management</h2>
          <p className="text-muted-foreground/80">
            Manage employee list and their information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="shadow-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? "Update employee information"
                  : "Fill in the information to add a new employee"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Full Name</Label>
                <Input
                  id="employee"
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  placeholder="Enter employee name"
                  className="shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.Position}
                  onChange={(e) => setFormData({ ...formData, Position: e.target.value })}
                  placeholder="Enter position"
                  className="shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.Department}
                  onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                  placeholder="Enter department"
                  className="shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.Status}
                  onValueChange={(value) => setFormData({ ...formData, Status: value })}
                >
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={
                  createEmployeeMutation.isPending ||
                  updateEmployeeMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  createEmployeeMutation.isPending ||
                  updateEmployeeMutation.isPending ||
                  !formData.employee ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.Position ||
                  !formData.Department ||
                  !formData.Status
                }
              >
                {createEmployeeMutation.isPending ||
                updateEmployeeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingEmployee ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingEmployee ? "Update" : "Add"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Employee List</CardTitle>
              <CardDescription className="text-sm">
                Total {filteredEmployees.length} employee
                {filteredEmployees.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 shadow-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Position</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground/70"
                  >
                    {searchQuery
                      ? "No employees found matching your search"
                      : "No employees found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                            {getInitials(employee.employee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{employee.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.Position}</TableCell>
                    <TableCell>{employee.Department}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          employee.Status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                        }
                      >
                        {employee.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(employee)}
                          className="h-8 w-8 hover:bg-primary/10"
                          disabled={
                            deleteEmployeeMutation.isPending ||
                            updateEmployeeMutation.isPending
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
                          className="h-8 w-8 hover:bg-destructive/10"
                          disabled={deleteEmployeeMutation.isPending}
                        >
                          {deleteEmployeeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
