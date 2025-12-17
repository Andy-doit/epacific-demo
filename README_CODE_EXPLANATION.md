# Giải Thích Chi Tiết Source Code

## Mục Lục

1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [Entry Point - main.tsx](#entry-point---maintsx)
3. [State Management - Redux](#state-management---redux)
4. [Server State - React Query](#server-state---react-query)
5. [React Hooks](#react-hooks)
6. [Custom Hooks](#custom-hooks)
7. [Services Layer](#services-layer)
8. [API Layer](#api-layer)
9. [Real-time Communication - Socket.IO](#real-time-communication---socketio)
10. [Component Structure](#component-structure)
11. [Data Flow](#data-flow)

---

## Tổng Quan Kiến Trúc

Ứng dụng sử dụng **kiến trúc phân lớp (Layered Architecture)** với các tầng:

```
┌─────────────────────────────────────┐
│      UI Components (Pages)          │
├─────────────────────────────────────┤
│      Custom Hooks                   │
├─────────────────────────────────────┤
│  React Query (Server State)         │
│  Redux (Client State)               │
│  Socket.IO (Real-time)              │
├─────────────────────────────────────┤
│      Services Layer                 │
├─────────────────────────────────────┤
│      API Layer (Axios)              │
└─────────────────────────────────────┘
```

### Công nghệ sử dụng:

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Redux Toolkit**: Global state management
- **React Query (TanStack Query)**: Server state management
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client
- **React Router DOM**: Routing
- **Shadcn UI**: Component library

---

## Entry Point - main.tsx

### File: `src/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <App />
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </Provider>
  </StrictMode>,
)
```

### Giải thích từng phần:

#### 1. **`createRoot`** (React 18+)
- Tạo root container cho React app
- Thay thế `ReactDOM.render` (cũ)
- Hỗ trợ Concurrent Features

#### 2. **`StrictMode`**
- Development mode: Phát hiện lỗi tiềm ẩn
- Double-invoke components để phát hiện side effects
- Cảnh báo về deprecated APIs

#### 3. **`<Provider store={store}>`** (Redux)
- **Mục đích**: Cung cấp Redux store cho toàn bộ app
- **Cách hoạt động**: 
  - Wrap app trong Provider
  - Tất cả components có thể dùng `useSelector`, `useDispatch`
  - Store được inject vào React Context

#### 4. **`<QueryProvider>`** (React Query)
- **Mục đích**: Cung cấp QueryClient cho toàn bộ app
- **Cách hoạt động**:
  - Tạo QueryClient instance
  - Cung cấp cache, mutations cho components
  - Quản lý server state (API data)

#### 5. **`<Toaster>`** (Sonner)
- Toast notification library
- Hiển thị thông báo success/error
- `position="top-right"`: Vị trí hiển thị
- `richColors`: Màu sắc đẹp hơn

### Thứ tự Provider quan trọng:

```typescript
<Provider store={store}>        // Redux - ngoài cùng
  <QueryProvider>               // React Query - giữa
    <App />                     // App - trong cùng
  </QueryProvider>
</Provider>
```

**Lý do**: Redux Provider cần wrap QueryProvider để Query có thể dispatch Redux actions nếu cần.

---

## State Management - Redux

### 1. Redux Store Configuration

#### File: `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profile.slice';
import employeeReducer from './slices/employee.slice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    employee: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Giải thích:

#### **`configureStore`** (Redux Toolkit)
- Tự động setup:
  - Redux DevTools
  - Thunk middleware
  - Immutability checks
- **Reducer**: Combine nhiều reducers thành 1 store

#### **State Structure:**
```typescript
{
  profile: {
    currentProfile: Profile | null,
    isLoading: boolean,
    error: string | null
  },
  employee: {
    employees: Employee[],
    isLoading: boolean,
    error: string | null,
    selectedEmployee: Employee | null
  }
}
```

#### **`serializableCheck`**
- Kiểm tra actions có thể serialize (JSON)
- `ignoredActions`: Bỏ qua check cho actions này (dùng với redux-persist)

#### **TypeScript Types:**
- `RootState`: Type của toàn bộ state
- `AppDispatch`: Type của dispatch function

### 2. Typed Hooks

#### File: `src/store/hooks.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Giải thích:

#### **`useAppDispatch`**
- Typed version của `useDispatch`
- TypeScript biết dispatch nhận action nào
- Autocomplete khi dispatch actions

#### **`useAppSelector`**
- Typed version của `useSelector`
- TypeScript biết state structure
- Autocomplete khi select state

#### **Ví dụ sử dụng:**
```typescript
// ❌ Không typed (không biết state structure)
const profile = useSelector(state => state.profile.currentProfile);

// ✅ Typed (autocomplete, type-safe)
const profile = useAppSelector(state => state.profile.currentProfile);
```

### 3. Profile Slice

#### File: `src/store/slices/profile.slice.ts`

```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@/types/profile.types';

interface ProfileState {
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.currentProfile) {
        state.currentProfile = {
          ...state.currentProfile,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.currentProfile = null;
      state.error = null;
    },
  },
});

export const { setProfile, updateProfile, setLoading, setError, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
```

### Giải thích chi tiết:

#### **`createSlice`** (Redux Toolkit)
- Tự động tạo:
  - Actions
  - Reducer
  - Action creators

#### **Immutability (Immer)**
- Redux Toolkit dùng **Immer** tự động
- Có thể viết "mutating" code:
```typescript
// ✅ Được phép (Immer tự động convert)
state.currentProfile = action.payload;

// ❌ Không cần (cách cũ)
return {
  ...state,
  currentProfile: action.payload
}
```

#### **Actions:**

1. **`setProfile`**
   - Set profile mới
   - Clear error

2. **`updateProfile`**
   - Update một phần profile
   - Merge với profile hiện tại

3. **`setLoading`**
   - Set loading state

4. **`setError`**
   - Set error message

5. **`clearProfile`**
   - Reset về initial state

#### **Cách sử dụng:**
```typescript
// Dispatch action
dispatch(setProfile(profileData));

// Select state
const profile = useAppSelector(state => state.profile.currentProfile);
```

### 4. Employee Slice

#### File: `src/store/slices/employee.slice.ts`

Tương tự Profile Slice, nhưng quản lý array:

```typescript
reducers: {
  setEmployees: (state, action: PayloadAction<Employee[]>) => {
    state.employees = action.payload;
    state.error = null;
  },
  addEmployee: (state, action: PayloadAction<Employee>) => {
    state.employees.push(action.payload);  // Immer tự động immutable
  },
  updateEmployee: (state, action: PayloadAction<Employee>) => {
    const index = state.employees.findIndex(
      (emp) => emp.id === action.payload.id
    );
    if (index !== -1) {
      state.employees[index] = action.payload;  // Immer tự động immutable
    }
  },
  removeEmployee: (state, action: PayloadAction<string>) => {
    state.employees = state.employees.filter(
      (emp) => emp.id !== action.payload
    );
  },
}
```

### Giải thích:

#### **Array Operations với Immer:**
- `push()`: Thêm vào cuối
- `filter()`: Xóa phần tử
- `findIndex()` + assignment: Update phần tử

**Immer tự động convert thành immutable operations!**

---

## Server State - React Query

### 1. Query Provider

#### File: `src/providers/QueryProvider.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Giải thích:

#### **`QueryClient`**
- Quản lý cache, queries, mutations
- Singleton instance (1 instance cho toàn app)

#### **Default Options:**

1. **`refetchOnWindowFocus: false`**
   - Không refetch khi user quay lại tab
   - Tiết kiệm API calls

2. **`retry: 1`**
   - Retry 1 lần nếu request fail
   - Tránh spam API khi có lỗi

3. **`staleTime: 5 * 60 * 1000`** (5 phút)
   - Data được coi là "fresh" trong 5 phút
   - Không refetch nếu data còn fresh

4. **`mutations.retry: 1`**
   - Retry mutations 1 lần

### 2. Profile Hooks

#### File: `src/hooks/api/useProfile.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import type { UpdateProfilePayload } from '@/types/profile.types';
import { toast } from 'sonner';

const PROFILE_QUERY_KEY = ['profile'] as const;

// Query Hook - Fetch data
export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Mutation Hook - Update data
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProfilePayload }) =>
      profileService.updateProfile(id, payload),
    onSuccess: (data) => {
      // Update cache với data mới
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      // Invalidate để refetch nếu cần
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update profile', {
        description: error.message,
      });
    },
  });
};
```

### Giải thích chi tiết:

#### **`useQuery`** - Fetch Data

**Cách hoạt động:**
1. Component mount → Gọi `queryFn`
2. Data được cache với `queryKey`
3. Nếu data còn fresh → Dùng cache, không gọi API
4. Nếu data stale → Refetch

**Return values:**
```typescript
{
  data: Profile | undefined,      
  isLoading: boolean,             
  isFetching: boolean,            
  error: Error | null,            
  refetch: () => void,            
}
```

**Query Key:**
- `['profile']`: Unique identifier cho query
- Dùng để cache, invalidate, update

**Stale Time:**
- `5 * 60 * 1000`: 5 phút
- Trong 5 phút, data được coi là fresh
- Không refetch nếu data còn fresh


#### **`useMutation`** - Update Data

**Cách hoạt động:**
1. Gọi `mutationFn` khi mutate
2. `onSuccess`: Update cache, invalidate queries
3. `onError`: Hiển thị error toast

**Return values:**
```typescript
{
  mutate: (variables) => void,           // Gọi mutation
  mutateAsync: (variables) => Promise,   // Gọi mutation (async)
  isPending: boolean,                     // Đang mutate
  isSuccess: boolean,                     // Thành công
  isError: boolean,                       // Có lỗi
  data: Profile | undefined,              // Data sau khi mutate
  error: Error | null,                    // Lỗi nếu có
}
```

**Cache Management:**

1. **`setQueryData`**: Update cache ngay lập tức
   ```typescript
   queryClient.setQueryData(PROFILE_QUERY_KEY, data);
   // UI update ngay, không cần refetch
   ```

2. **`invalidateQueries`**: Đánh dấu cache là stale
   ```typescript
   queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
   // Sẽ refetch khi component mount lại hoặc refetch được gọi
   ```

### 3. Employee Hooks

#### File: `src/hooks/api/useEmployees.ts`

Tương tự Profile, nhưng có nhiều mutations:

```typescript
export const useEmployees = () => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: () => employeeService.getEmployees(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      employeeService.createEmployee(payload),
    onSuccess: () => {
      // Invalidate để refetch list
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success('Employee created successfully');
    },
  });
};
```

### Giải thích:

#### **Invalidate sau Mutation:**
- Sau khi create/update/delete → Invalidate queries
- Tự động refetch list employees
- UI luôn sync với server

#### **Optimistic Updates (Có thể cải thiện):**
```typescript
// Có thể update cache trước khi API response
onMutate: async (newEmployee) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: EMPLOYEES_QUERY_KEY });
  
  // Snapshot previous value
  const previous = queryClient.getQueryData(EMPLOYEES_QUERY_KEY);
  
  // Optimistically update
  queryClient.setQueryData(EMPLOYEES_QUERY_KEY, (old) => [...old, newEmployee]);
  
  return { previous };
},
onError: (err, newEmployee, context) => {
  // Rollback on error
  queryClient.setQueryData(EMPLOYEES_QUERY_KEY, context.previous);
},
```

---

## React Hooks

### 1. useState

#### Cách hoạt động:

```typescript
const [state, setState] = useState(initialValue);
```

**Ví dụ trong MessagesPage:**
```typescript
const [showUsernameDialog, setShowUsernameDialog] = useState(false);
const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
const [message, setMessage] = useState("");
```

**Giải thích:**
- `useState` tạo state local cho component
- Mỗi lần `setState` → Component re-render
- State chỉ tồn tại trong component đó

**Khi nào dùng:**
- ✅ Local UI state (dialog open/close, input value)
- ✅ State không cần share giữa components
- ❌ Không dùng cho global state (dùng Redux)
- ❌ Không dùng cho server state (dùng React Query)

### 2. useEffect

#### Cách hoạt động:

```typescript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

**Ví dụ trong MessagesPage:**

```typescript
// 1. Initialize socket connection
useEffect(() => {
  const savedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
  if (!savedUsername) {
    setShowUsernameDialog(true);
  } else {
    connect();
    setTimeout(() => {
      setUsername(savedUsername);
    }, 100);
  }
}, [connect, setUsername]);
```

**Giải thích:**
- Chạy sau khi component mount
- Chạy lại khi dependencies thay đổi
- `[connect, setUsername]`: Dependencies (nên stable)

**Ví dụ 2: Convert messages**

```typescript
useEffect(() => {
  if (socketMessages && currentUser) {
    const convertedMessages: Message[] = socketMessages.map((msg, index) => ({
      id: `msg-${index}-${msg.timestamp}`,
      from: msg.from,
      message: msg.message,
      // ...
      isOwn: msg.from.socketId === currentUser.socketId,
    }));
    setMessages(convertedMessages);
  }
}, [socketMessages, currentUser]);
```

**Giải thích:**
- Convert socket messages thành UI messages
- Chạy khi `socketMessages` hoặc `currentUser` thay đổi
- Thêm `isOwn` để biết message của mình

**Ví dụ 3: Auto scroll**

```typescript
useEffect(() => {
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  scrollToBottom();
}, [messages, selectedUser, selectedGroup]);
```

**Giải thích:**
- Scroll xuống cuối khi có message mới
- `setTimeout`: Đợi DOM update xong
- `messagesEndRef`: Ref đến element cuối

**Cleanup Example:**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => {
    clearInterval(interval);  // Cleanup khi unmount
  };
}, []);
```

### 3. useMemo

#### Cách hoạt động:

```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

**Ví dụ trong EmployeesPage:**

```typescript
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
```

**Giải thích:**
- Cache kết quả filter
- Chỉ tính lại khi `employees` hoặc `searchQuery` thay đổi
- Tránh filter lại mỗi render

**Khi nào dùng:**
- ✅ Tính toán phức tạp (filter, map, reduce)
- ✅ Tạo object/array mới (tránh re-render child)
- ❌ Không dùng cho giá trị đơn giản (overhead)

### 4. useCallback

#### Cách hoạt động:

```typescript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**Ví dụ trong EmployeesPage:**

```typescript
const handleOpenDialog = useCallback((employee?: Employee) => {
  if (employee) {
    setEditingEmployee(employee);
    setFormData({
      employee: employee.employee,
      email: employee.email,
      // ...
    });
  } else {
    setEditingEmployee(null);
    setFormData({
      employee: "",
      email: "",
      // ...
    });
  }
  setIsDialogOpen(true);
}, []);
```

**Giải thích:**
- Cache function reference
- Dependencies rỗng `[]` → Function không bao giờ thay đổi
- Tránh re-render child components

**Khi nào dùng:**
- ✅ Function được truyền vào child components
- ✅ Function trong dependencies của hooks khác
- ✅ Function trong map/render list

### 5. useRef

#### Cách hoạt động:

```typescript
const ref = useRef(initialValue);
```

**Ví dụ trong MessagesPage:**

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
const scrollAreaRef = useRef<HTMLDivElement>(null);
```

**Giải thích:**
- Lưu reference đến DOM element
- Không trigger re-render khi thay đổi
- Dùng để:
  - Scroll đến element
  - Focus input
  - Measure element size

**Sử dụng:**
```typescript
<div ref={messagesEndRef} />
// Sau đó:
messagesEndRef.current?.scrollIntoView();
```

---

## Custom Hooks

### 1. useTheme Hook

#### File: `src/hooks/use-theme.ts`

```typescript
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("theme") as Theme;
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
```

### Giải thích:

#### **Lazy Initialization:**
```typescript
useState(() => {
  // Function chỉ chạy 1 lần khi mount
  // Tránh đọc localStorage mỗi render
  return localStorage.getItem("theme") || "light";
})
```

#### **useEffect để sync:**
- Apply theme vào DOM (`dark` class)
- Save vào localStorage
- Chạy khi `theme` thay đổi

#### **Toggle Function:**
- Toggle giữa light/dark
- State update → useEffect chạy → DOM update

### 2. useSocket Hook

#### File: `src/hooks/use-socket.ts`

Hook phức tạp quản lý Socket.IO connection:

```typescript
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ socketId: string; username: string } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});

  const socketRef = useRef<Socket | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);
```

### Giải thích:

#### **State Management:**
- `socket`: Socket instance
- `isConnected`: Connection status
- `currentUser`: User hiện tại
- `onlineUsers`: Danh sách users online
- `messages`: Messages trong room hiện tại
- `lastMessages`: Last message của mỗi room
- `chatHistory`: Lịch sử chat (persist)

#### **Refs:**
- `socketRef`: Lưu socket instance (không trigger re-render)
- `currentRoomIdRef`: Lưu room ID hiện tại

#### **Functions:**

1. **`connect()`**: Kết nối socket
2. **`setUsername()`**: Set username
3. **`joinChat()`**: Join room chat
4. **`sendMessage()`**: Gửi text message
5. **`sendFile()`**: Gửi file
6. **`sendImage()`**: Gửi image
7. **`sendEmoji()`**: Gửi emoji
8. **`getChatHistory()`**: Load lịch sử
9. **`logout()`**: Disconnect

#### **LocalStorage Persistence:**
```typescript
// Load chat history on mount
useEffect(() => {
  const savedHistory = localStorage.getItem('chat-history');
  if (savedHistory) {
    setChatHistory(JSON.parse(savedHistory));
  }
}, []);

// Save chat history when it changes
useEffect(() => {
  localStorage.setItem('chat-history', JSON.stringify(chatHistory));
}, [chatHistory]);
```

---

## Services Layer

### 1. Profile Service

#### File: `src/services/profile.service.ts`

```typescript
import { apiClient } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Profile, UpdateProfilePayload } from '@/types/profile.types';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile[]>(API_ENDPOINTS.PROFILE.GET);
    // API returns array, we take the first item
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error('No profile data found');
  },

  updateProfile: async (
    id: string,
    payload: UpdateProfilePayload
  ): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
      API_ENDPOINTS.PROFILE.UPDATE(id),
      payload
    );
    return response.data;
  },
};
```

### Giải thích:

#### **Service Pattern:**
- Tách logic API calls ra khỏi components
- Dễ test, dễ maintain
- Reusable

#### **Type Safety:**
- `Promise<Profile>`: Return type
- `apiClient.get<Profile[]>`: Response type
- TypeScript check tại compile time

### 2. Employee Service

#### File: `src/services/employee.service.ts`

Tương tự Profile Service, nhưng có CRUD đầy đủ:

```typescript
export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>(API_ENDPOINTS.EMPLOYEES.GET);
    return response.data;
  },

  createEmployee: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const response = await apiClient.post<Employee>(
      API_ENDPOINTS.EMPLOYEES.CREATE,
      payload
    );
    return response.data;
  },

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

  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
  },
};
```

---

## API Layer

### 1. Axios Configuration

#### File: `src/api/axios.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth-token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);
```

### Giải thích:

#### **Axios Instance:**
- `baseURL`: Base URL cho tất cả requests
- `timeout`: 10 giây
- `headers`: Default headers

#### **Request Interceptor:**
- Tự động thêm auth token vào mọi request
- Token lấy từ localStorage

#### **Response Interceptor:**
- Handle 401 (Unauthorized)
- Tự động xóa token, có thể redirect login

### 2. API Endpoints

#### File: `src/api/endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  PROFILE: {
    GET: '/information',
    UPDATE: (id: string) => `/information/${id}`,
  },
  EMPLOYEES: {
    GET: '/product',
    CREATE: '/product',
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
  },
} as const;
```

### Giải thích:

#### **Centralized Endpoints:**
- Tất cả endpoints ở 1 nơi
- Dễ maintain, dễ thay đổi
- Type-safe với `as const`

---

## Real-time Communication - Socket.IO

### Socket Hook Implementation

#### File: `src/hooks/use-socket.ts`

### Giải thích chi tiết:

#### **1. Connection Management:**

```typescript
const connect = useCallback(() => {
  if (socketRef.current?.connected) return;

  const newSocket = createSocket();
  socketRef.current = newSocket;

  newSocket.on('connect', () => {
    setIsConnected(true);
  });

  newSocket.on('disconnect', () => {
    setIsConnected(false);
  });
}, []);
```

**Giải thích:**
- `useCallback`: Cache function
- `socketRef`: Lưu socket instance
- Event listeners: `connect`, `disconnect`

#### **2. User Management:**

```typescript
const setUsername = useCallback((username: string) => {
  if (!socketRef.current) return;
  
  socketRef.current.emit('set-username', username);
  localStorage.setItem('chat-username', username);
}, []);
```

**Giải thích:**
- Emit event `set-username` lên server
- Save vào localStorage

#### **3. Message Handling:**

```typescript
newSocket.on('message', (message: ChatMessage) => {
  setMessages((prev) => [...prev, message]);
  
  // Update last message
  if (currentRoomIdRef.current) {
    updateLastMessage(currentRoomIdRef.current, message);
  }
});
```

**Giải thích:**
- Listen event `message`
- Add vào messages array
- Update last message

#### **4. File/Image Handling:**

```typescript
const sendFile = useCallback((file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileData = e.target?.result as string;
    socketRef.current?.emit('send-file', {
      roomId: currentRoomIdRef.current,
      fileName: file.name,
      fileData,
      fileType: file.type,
      fileSize: file.size,
    });
  };
  reader.readAsDataURL(file);
}, []);
```

**Giải thích:**
- `FileReader`: Đọc file thành base64
- Emit `send-file` event với file data
- Server broadcast đến room

---

## Component Structure

### 1. Pages

#### MessagesPage (`src/pages/MessagesPage.tsx`)

**State Management:**
```typescript
// Local state
const [showUsernameDialog, setShowUsernameDialog] = useState(false);
const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
const [message, setMessage] = useState("");

// Socket state (từ useSocket hook)
const { currentUser, onlineUsers, messages, ... } = useSocket();
```

**Data Flow:**
1. Component mount → Check username
2. Connect socket → Get online users
3. User click → Join chat → Load messages
4. Send message → Socket emit → Update UI

#### ProfilePage (`src/pages/ProfilePage.tsx`)

**State Management:**
```typescript
// React Query
const { data: profile, isLoading, error } = useProfile();
const updateProfileMutation = useUpdateProfile();

// Local state
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState<Partial<Profile>>({});

// Redux sync
useEffect(() => {
  if (profile) {
    dispatch(setProfile(profile));
  }
}, [profile, dispatch]);
```

**Data Flow:**
1. Component mount → `useProfile()` fetch data
2. Data cached → Display profile
3. User edit → Update `formData`
4. User save → `updateProfileMutation` → API call
5. Success → Update cache + Redux

#### EmployeesPage (`src/pages/EmployeesPage.tsx`)

**State Management:**
```typescript
// React Query
const { data: employees = [], isLoading, error } = useEmployees();
const createEmployeeMutation = useCreateEmployee();
const updateEmployeeMutation = useUpdateEmployee();
const deleteEmployeeMutation = useDeleteEmployee();

// Local state
const [searchQuery, setSearchQuery] = useState("");
const [isDialogOpen, setIsDialogOpen] = useState(false);

// Memoized filtered employees
const filteredEmployees = useMemo(() => {
  // Filter logic
}, [employees, searchQuery]);
```

**Data Flow:**
1. Component mount → `useEmployees()` fetch list
2. User search → Filter employees (memoized)
3. User create/update/delete → Mutation → Invalidate → Refetch

### 2. Layout Component

#### DashboardLayout (`src/components/layout/DashboardLayout.tsx`)

**Features:**
- Sidebar navigation
- Header với theme switcher
- `Outlet` cho nested routes

**Theme Integration:**
```typescript
const { theme, toggleTheme } = useTheme();

<Button onClick={toggleTheme}>
  {theme === "light" ? <Sun /> : <Moon />}
</Button>
```

---

## Data Flow

### 1. Profile Data Flow

```
┌─────────────┐
│ ProfilePage │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  useProfile()    │  ← React Query Hook
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ profileService  │  ← Service Layer
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   apiClient     │  ← Axios Instance
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Backend API   │
└──────────────────┘

Response Flow:
Backend → apiClient → profileService → useProfile → ProfilePage
         ↓
    React Query Cache
         ↓
    Redux Store (sync)
```

### 2. Employee CRUD Flow

```
Create Employee:
┌──────────────┐
│EmployeesPage │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│useCreateEmployee()  │  ← Mutation Hook
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│employeeService      │
│.createEmployee()    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   POST /product     │
└─────────────────────┘

onSuccess:
  ↓
invalidateQueries(['employees'])
  ↓
Auto refetch employees list
  ↓
UI update automatically
```

### 3. Chat Message Flow

```
Send Message:
┌─────────────┐
│MessagesPage │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  useSocket()     │
│  sendMessage()  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Socket.IO Client │
│  emit('message') │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Socket.IO Server│
│  (broadcast)     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Other Clients     │
│  on('message')    │
└──────────────────┘
```

---

## Tổng Kết

### State Management Strategy:

1. **Local State (useState)**: UI state, form state
2. **Redux**: Global client state (profile, employees)
3. **React Query**: Server state (API data, cache)
4. **Socket.IO**: Real-time state (messages, online users)

### Best Practices Đã Áp Dụng:

✅ **Separation of Concerns**: Services, Hooks, Components tách biệt
✅ **Type Safety**: TypeScript cho tất cả
✅ **Memoization**: useMemo, useCallback cho performance
✅ **Error Handling**: Try-catch, error states
✅ **Loading States**: isLoading, isPending
✅ **Cache Management**: React Query cache + Redux sync
✅ **Code Splitting**: Lazy loading routes

### File Structure:

```
src/
├── api/              # API configuration
├── components/       # Reusable components
├── hooks/           # Custom hooks
│   ├── api/         # React Query hooks
│   ├── use-socket.ts
│   └── use-theme.ts
├── pages/           # Page components
├── providers/       # Context providers
├── services/        # API service layer
├── store/           # Redux store
│   ├── slices/      # Redux slices
│   ├── hooks.ts     # Typed hooks
│   └── index.ts     # Store config
├── types/           # TypeScript types
└── utils/            # Utility functions
```

---

## Kết Luận

Source code được tổ chức theo **best practices**:
- ✅ Clear separation of concerns
- ✅ Type-safe với TypeScript
- ✅ Performance optimized
- ✅ Maintainable và scalable
- ✅ Error handling đầy đủ
- ✅ Real-time communication
- ✅ State management hiệu quả

