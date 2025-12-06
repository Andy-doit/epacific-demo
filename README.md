# Employee Chat Management System

## 📋 Tổng quan

Ứng dụng **Employee Chat Management System** là một hệ thống quản lý nhân viên và chat nội bộ được xây dựng bằng React, TypeScript, và các công nghệ hiện đại. Ứng dụng cung cấp 3 chức năng chính:

1. **Messages**: Chat real-time giữa các nhân viên
2. **Profile**: Quản lý và cập nhật thông tin cá nhân
3. **Employees**: Quản lý danh sách nhân viên với đầy đủ CRUD operations

## 🛠️ Công nghệ sử dụng

### Core Framework & Language

#### **React 19.2.0**
- **Lý do**: React là framework phổ biến nhất cho frontend, có ecosystem lớn, cộng đồng hỗ trợ mạnh
- **Ứng dụng**: Xây dựng toàn bộ UI components, quản lý state, và xử lý user interactions

#### **TypeScript 5.9.3**
- **Lý do**: Type safety giúp phát hiện lỗi sớm, cải thiện developer experience, dễ maintain code
- **Ứng dụng**: Toàn bộ codebase sử dụng TypeScript để đảm bảo type safety

#### **Vite 7.2.4**
- **Lý do**: Build tool nhanh hơn Webpack, HMR (Hot Module Replacement) nhanh, cấu hình đơn giản
- **Ứng dụng**: Development server, build production, và optimize assets

### UI Framework & Styling

#### **Shadcn UI**
- **Lý do**: Component library dựa trên Radix UI, có thể customize hoàn toàn, không phụ thuộc vào framework cụ thể
- **Ứng dụng**: Tất cả UI components (Button, Card, Dialog, Table, Sidebar, etc.)
- **Components sử dụng**:
  - `@radix-ui/react-avatar`: Avatar component
  - `@radix-ui/react-dialog`: Dialog/Modal
  - `@radix-ui/react-dropdown-menu`: Dropdown menu
  - `@radix-ui/react-popover`: Popover (cho emoji picker)
  - `@radix-ui/react-scroll-area`: Scrollable areas
  - `@radix-ui/react-select`: Select dropdown
  - `@radix-ui/react-separator`: Separator line
  - `@radix-ui/react-tabs`: Tabs component
  - `@radix-ui/react-tooltip`: Tooltip

#### **Tailwind CSS 4.1.17**
- **Lý do**: Utility-first CSS framework, viết CSS nhanh, responsive dễ dàng, bundle size nhỏ
- **Ứng dụng**: Toàn bộ styling của ứng dụng
- **Plugin**: `@tailwindcss/vite` - tích hợp Tailwind với Vite

#### **Lucide React 0.555.0**
- **Lý do**: Icon library nhẹ, đẹp, có nhiều icons, tree-shakeable
- **Ứng dụng**: Tất cả icons trong ứng dụng (MessageSquare, User, Users, Sun, Moon, etc.)

### State Management

#### **Redux Toolkit 2.11.0**
- **Lý do**: Quản lý global state tập trung, dễ debug với Redux DevTools, pattern rõ ràng
- **Ứng dụng**: 
  - Quản lý state của Profile (`profile.slice.ts`)
  - Quản lý state của Employees (`employee.slice.ts`)
- **Cấu trúc**:
  ```typescript
  store/
    ├── index.ts          // Store configuration
    ├── hooks.ts          // Typed hooks (useAppDispatch, useAppSelector)
    └── slices/
        ├── profile.slice.ts
        └── employee.slice.ts
  ```

#### **React Redux 9.2.0**
- **Lý do**: Official binding giữa React và Redux
- **Ứng dụng**: Kết nối React components với Redux store

#### **TanStack Query (React Query) 5.90.12**
- **Lý do**: Quản lý server state tốt hơn Redux cho async data, tự động cache, refetch, retry
- **Ứng dụng**: 
  - Fetch và cache data từ API (Profile, Employees)
  - Tự động refetch khi cần
  - Optimistic updates
- **Cấu hình**:
  - `staleTime`: 5 phút (cho profile), 2 phút (cho employees)
  - `retry`: 1-2 lần
  - `refetchOnWindowFocus`: false (không refetch khi focus lại window)

### Routing

#### **React Router DOM 7.10.0**
- **Lý do**: Standard routing library cho React, hỗ trợ nested routes, code splitting
- **Ứng dụng**: 
  - Route `/messages` → MessagesPage
  - Route `/profile` → ProfilePage
  - Route `/employees` → EmployeesPage
  - Nested routes với DashboardLayout

### Real-time Communication

#### **Socket.IO Client 4.8.1**
- **Lý do**: Library phổ biến cho real-time communication, hỗ trợ fallback (polling), tự động reconnect
- **Ứng dụng**: 
  - Chat real-time giữa users
  - Gửi/nhận messages, files, images, emojis
  - Quản lý online users
  - Join/leave chat rooms
- **Cấu hình**:
  - `transports`: ['websocket', 'polling'] - fallback nếu websocket fail
  - `autoConnect`: false - connect thủ công
  - `reconnection`: true - tự động reconnect
  - `reconnectionAttempts`: 5

### HTTP Client

#### **Axios 1.13.2**
- **Lý do**: HTTP client tốt hơn fetch, hỗ trợ interceptors, tự động transform JSON
- **Ứng dụng**: 
  - Gọi API cho Profile và Employees
  - Request/Response interceptors cho authentication
  - Error handling tập trung

### UI Enhancements

#### **Sonner 2.0.7**
- **Lý do**: Toast notification library đẹp, nhẹ, dễ sử dụng
- **Ứng dụng**: Hiển thị notifications cho các actions (success, error, info)

#### **Emoji Picker React 4.16.1**
- **Lý do**: Emoji picker component đẹp, dễ tích hợp
- **Ứng dụng**: Cho phép users chọn và gửi emoji trong chat

### Utilities

#### **clsx 2.1.1 & tailwind-merge 3.4.0**
- **Lý do**: Merge và combine class names, xử lý conflicts trong Tailwind classes
- **Ứng dụng**: Function `cn()` để combine conditional classes

#### **class-variance-authority 0.7.1**
- **Lý do**: Quản lý variant classes cho components (Shadcn UI sử dụng)
- **Ứng dụng**: Tạo variants cho UI components

### Testing

#### **Vitest 3.2.4**
- **Lý do**: Test runner nhanh, tương thích với Vite, API giống Jest
- **Ứng dụng**: Unit tests và integration tests

#### **Testing Library (React, DOM, Jest-DOM)**
- **Lý do**: Best practices cho testing React components, focus vào user behavior
- **Ứng dụng**: 
  - `@testing-library/react`: Render và test React components
  - `@testing-library/dom`: DOM testing utilities
  - `@testing-library/jest-dom`: Custom matchers (toBeInTheDocument, etc.)

#### **jsdom 27.0.1**
- **Lý do**: DOM implementation cho Node.js, cần cho testing React components
- **Ứng dụng**: Môi trường test giống browser

### Development Tools

#### **ESLint 9.39.1**
- **Lý do**: Linter để đảm bảo code quality, consistency
- **Plugins**:
  - `eslint-plugin-react-hooks`: Rules cho React hooks
  - `eslint-plugin-react-refresh`: HMR safety
  - `typescript-eslint`: TypeScript linting

#### **TypeScript ESLint 8.46.4**
- **Lý do**: ESLint rules cho TypeScript
- **Ứng dụng**: Type checking và linting cho TypeScript code

## 📁 Cấu trúc dự án

```
Chat/
├── public/                 # Static assets
├── src/
│   ├── __tests__/         # Test files
│   │   ├── UserList.test.tsx
│   │   ├── MessageInput.test.tsx
│   │   ├── MessageList.test.tsx
│   │   └── UsernameDialog.test.tsx
│   ├── api/               # API configuration
│   │   ├── axios.ts       # Axios instance với interceptors
│   │   └── endpoints.ts   # API endpoints constants
│   ├── components/        # React components
│   │   ├── chat/          # Chat-related components
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── MessageItem.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── UserList.tsx
│   │   ├── layout/        # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   ├── ui/            # Shadcn UI components
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── table.tsx
│   │   │   └── ... (các components khác)
│   │   └── UsernameDialog.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── api/           # API hooks (React Query)
│   │   │   ├── useEmployees.ts
│   │   │   └── useProfile.ts
│   │   ├── use-socket.ts  # Socket.IO hook
│   │   └── use-theme.ts   # Theme management hook
│   ├── lib/               # Utility libraries
│   │   ├── socket.ts      # Socket.IO client factory
│   │   └── utils.ts       # Utility functions (cn, etc.)
│   ├── pages/             # Page components
│   │   ├── EmployeesPage.tsx
│   │   ├── MessagesPage.tsx
│   │   └── ProfilePage.tsx
│   ├── providers/         # Context providers
│   │   └── QueryProvider.tsx  # React Query provider
│   ├── services/          # API service layer
│   │   ├── employee.service.ts
│   │   └── profile.service.ts
│   ├── store/             # Redux store
│   │   ├── hooks.ts       # Typed Redux hooks
│   │   ├── index.ts       # Store configuration
│   │   └── slices/        # Redux slices
│   │       ├── employee.slice.ts
│   │       └── profile.slice.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── chat.ts
│   │   ├── employee.types.ts
│   │   └── profile.types.ts
│   ├── utils/             # Utility functions
│   │   └── format.ts      # Formatting functions
│   ├── App.tsx            # Main app component với routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles với Tailwind
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── package.json
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Vitest configuration
└── vitest.setup.ts        # Test setup file
```

## 🏗️ Kiến trúc ứng dụng

### 1. Entry Point (`main.tsx`)

```typescript
// Wraps app với các providers:
// 1. Redux Provider - cho state management
// 2. QueryProvider - cho server state (React Query)
// 3. Toaster - cho notifications
```

**Flow**:
1. App khởi tạo → Render `App.tsx`
2. `App.tsx` → Setup routing với `BrowserRouter`
3. Routes → Render các pages trong `DashboardLayout`

### 2. Routing (`App.tsx`)

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Navigate to="/messages" />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="employees" element={<EmployeesPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Giải thích**:
- `BrowserRouter`: Sử dụng HTML5 history API cho routing
- Nested routes: Tất cả pages nằm trong `DashboardLayout` (có sidebar và header chung)
- Default route: Redirect `/` → `/messages`

### 3. Layout System (`DashboardLayout.tsx`)

**Cấu trúc**:
```
┌─────────────────────────────────────┐
│  Sidebar (Collapsible)              │
│  ├── Header (Logo + Title)          │
│  ├── Menu Items                      │
│  │   ├── Messages                    │
│  │   ├── Profile                     │
│  │   └── Employees                    │
│  └── Footer (User Info)              │
│                                     │
│  Main Content Area                  │
│  ├── Header (Title + Theme Switcher)│
│  └── <Outlet /> (Page Content)      │
└─────────────────────────────────────┘
```

**Features**:
- **Collapsible Sidebar**: Có thể thu gọn thành icon-only mode
- **Theme Switcher**: Toggle light/dark mode (lưu trong localStorage)
- **Active Route Highlighting**: Highlight menu item tương ứng với route hiện tại

### 4. Messages Page (`MessagesPage.tsx`)

**Chức năng chính**:
1. **Real-time Chat**: Sử dụng Socket.IO
2. **User List**: Hiển thị online users với last message
3. **Chat Interface**: Message bubbles, file/image sending, emoji support

**Flow hoạt động**:

```
1. User mở Messages Page
   ↓
2. Check localStorage cho username
   ↓
3. Nếu chưa có → Hiển thị UsernameDialog
   ↓
4. User nhập username → Connect Socket.IO
   ↓
5. Socket emit 'setUsername' → Server trả về 'usernameSet'
   ↓
6. Client emit 'getOnlineUsers' → Nhận danh sách users
   ↓
7. User click vào một user → Join chat room
   ↓
8. Socket emit 'joinChat' → Server tạo/join room
   ↓
9. Load chat history từ localStorage (nếu có)
   ↓
10. User gửi message → Socket emit 'sendMessage'
    ↓
11. Server broadcast → Tất cả users trong room nhận message
    ↓
12. Update UI + Lưu vào localStorage
```

**State Management**:
- **Socket State**: Quản lý bởi `useSocket` hook
  - `currentUser`: User hiện tại
  - `onlineUsers`: Danh sách users online
  - `messages`: Messages trong room hiện tại
  - `lastMessages`: Last message của mỗi conversation
  - `chatHistory`: Lịch sử chat (lưu trong localStorage)

**Components**:
- `UserList`: Danh sách users với tabs (All/Groups)
- `ChatHeader`: Header của chat với user info
- `MessageList`: Danh sách messages với auto-scroll
- `MessageInput`: Input area với emoji picker, file/image upload
- `EmptyState`: State khi chưa chọn user

### 5. Profile Page (`ProfilePage.tsx`)

**Chức năng**:
- Xem thông tin profile
- Edit profile (toggle edit mode)
- Update profile qua API

**Data Flow**:

```
1. Component mount
   ↓
2. useProfile() hook (React Query)
   ↓
3. profileService.getProfile() → API call
   ↓
4. Response → Update React Query cache
   ↓
5. Data → Component state + Redux store
   ↓
6. User edit → Update local state
   ↓
7. User save → useUpdateProfile() mutation
   ↓
8. API call → Update server
   ↓
9. Success → Update cache + Redux + Show toast
```

**State Management**:
- **Server State**: React Query (cache, refetch, etc.)
- **Client State**: Redux (profile slice) + Local component state (form data, edit mode)

### 6. Employees Page (`EmployeesPage.tsx`)

**Chức năng**:
- CRUD operations cho employees
- Search/filter employees
- Sort table columns
- Pagination (có thể thêm)

**Data Flow**:

```
1. Component mount
   ↓
2. useEmployees() hook (React Query)
   ↓
3. employeeService.getEmployees() → API call
   ↓
4. Response → Update React Query cache + Redux store
   ↓
5. User actions:
   - Create: useCreateEmployee() → Invalidate cache → Refetch
   - Update: useUpdateEmployee() → Invalidate cache → Refetch
   - Delete: useDeleteEmployee() → Invalidate cache → Refetch
```

**Features**:
- **Search**: Filter employees theo tên
- **Sort**: Sort theo các cột (Name, Email, Phone, Position, Department, Status)
- **Dialog**: Create/Edit employee trong dialog
- **Table**: Shadcn UI Table component với responsive design

## 🔌 Socket.IO Integration

### Socket Client Setup (`lib/socket.ts`)

```typescript
export const createSocket = (): Socket => {
  return io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Fallback
    autoConnect: false,                    // Connect thủ công
    reconnection: true,                     // Tự động reconnect
    reconnectionDelay: 1000,               // Delay 1s
    reconnectionDelayMax: 5000,             // Max delay 5s
    reconnectionAttempts: 5,                 // Thử 5 lần
  });
};
```

### Socket Hook (`hooks/use-socket.ts`)

**Events xử lý**:

**Client → Server**:
- `setUsername`: Set username khi login
- `getOnlineUsers`: Lấy danh sách users online
- `joinChat`: Join vào chat room với một user
- `sendMessage`: Gửi text message
- `sendFile`: Gửi file
- `sendImage`: Gửi image
- `sendEmoji`: Gửi emoji
- `logout`: Logout

**Server → Client**:
- `connect`: Socket connected
- `disconnect`: Socket disconnected
- `usernameSet`: Username đã được set
- `onlineUsers`: Danh sách users online
- `userConnected`: User mới connect
- `userDisconnected`: User disconnect
- `chatJoined`: Đã join vào chat room
- `receiveMessage`: Nhận message mới
- `receiveFile`: Nhận file
- `receiveImage`: Nhận image
- `receiveEmoji`: Nhận emoji
- `logoutSuccess`: Logout thành công

**Chat History Persistence**:
- Lưu chat history vào `localStorage` với key `chat-history`
- Format: `Record<roomId, ChatMessage[]>`
- Load khi component mount
- Save mỗi khi có message mới

## 🗄️ State Management

### Redux Store Structure

```typescript
store: {
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

### React Query Cache

```typescript
// Query Keys
['profile']
['employees']

// Cache Structure
{
  ['profile']: {
    data: Profile,
    staleTime: 5 * 60 * 1000, // 5 phút
  },
  ['employees']: {
    data: Employee[],
    staleTime: 2 * 60 * 1000, // 2 phút
  }
}
```

**Tại sao dùng cả Redux và React Query?**
- **Redux**: Quản lý client state (UI state, form state)
- **React Query**: Quản lý server state (API data, cache, sync)

## 🎨 Styling System

### Tailwind CSS Configuration

**Theme Variables** (`index.css`):
- Sử dụng CSS variables cho colors, radius, spacing
- Support dark mode với class `.dark`
- Custom theme với `@theme` directive (Tailwind v4)

**Color System**:
- `--background`: Background color
- `--foreground`: Text color
- `--primary`: Primary color
- `--muted`: Muted colors
- `--accent`: Accent color
- `--border`: Border color
- Và nhiều colors khác cho sidebar, card, etc.

### Component Styling

**Pattern**:
- Sử dụng Shadcn UI components (đã styled sẵn)
- Customize với Tailwind utilities
- Responsive với breakpoints (sm, md, lg, xl)
- Dark mode support với `dark:` prefix

## 🧪 Testing

### Test Setup

**Vitest Configuration** (`vitest.config.ts`):
```typescript
{
  globals: true,              // Global test functions
  environment: 'jsdom',       // Browser-like environment
  setupFiles: './vitest.setup.ts'  // Setup file
}
```

**Setup File** (`vitest.setup.ts`):
- Import `@testing-library/jest-dom` để có custom matchers

### Test Files

**UserList.test.tsx**:
- Test render online users
- Test click user → trigger callback
- Test display last message

**MessageInput.test.tsx**:
- Test input field
- Test send message
- Test emoji picker
- Test file/image upload

**MessageList.test.tsx**:
- Test render messages
- Test message bubbles (own vs received)
- Test auto-scroll

**UsernameDialog.test.tsx**:
- Test dialog open/close
- Test username input
- Test submit

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch     # Watch mode
npm run test:ui        # UI mode (Vitest UI)
```

## 🚀 Development Workflow

### 1. Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 2. Environment Variables

Tạo file `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Development Server

- **URL**: `http://localhost:5173` (Vite default)
- **HMR**: Hot Module Replacement tự động
- **Fast Refresh**: React Fast Refresh cho components

### 4. Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

**Output**: `dist/` folder chứa:
- `index.html`: Entry HTML
- `assets/`: JS, CSS, images đã được optimize và minify

### Build Optimization

**Vite tự động**:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## 🔐 Security Considerations

### 1. Authentication
- Token lưu trong `localStorage` (có thể upgrade lên httpOnly cookies)
- Axios interceptor tự động thêm token vào headers
- Handle 401 → Clear token và redirect

### 2. Socket.IO
- Validate username trước khi connect
- Room-based chat (chỉ users trong room mới nhận messages)
- Rate limiting (nên implement ở server)

### 3. Input Validation
- Validate form inputs
- Sanitize user inputs
- File size limits cho uploads

## 🎯 Best Practices Đã Áp Dụng

### 1. Code Organization
- **Separation of Concerns**: Tách biệt components, hooks, services, types
- **Feature-based Structure**: Group theo feature (chat, profile, employees)
- **Reusable Components**: UI components có thể tái sử dụng

### 2. Type Safety
- **TypeScript**: Toàn bộ codebase
- **Type Definitions**: Tách riêng file types
- **Typed Hooks**: Redux hooks với types

### 3. Performance
- **React Query Caching**: Giảm API calls
- **Code Splitting**: Lazy load routes (có thể thêm)
- **Memoization**: useMemo, useCallback khi cần
- **Virtual Scrolling**: Có thể thêm cho long lists

### 4. User Experience
- **Loading States**: Hiển thị loading khi fetch data
- **Error Handling**: Toast notifications cho errors
- **Optimistic Updates**: Update UI trước khi API response
- **Auto-scroll**: Chat tự động scroll đến message mới

### 5. Accessibility
- **ARIA Labels**: Cho screen readers
- **Keyboard Navigation**: Support keyboard
- **Focus Management**: Proper focus handling

## 🐛 Known Issues & Future Improvements

### Known Issues
1. Chat history chỉ lưu local → Mất khi clear browser data
2. Chưa có pagination cho employees table
3. Chưa có real-time updates cho employees (cần polling hoặc WebSocket)

### Future Improvements
1. **Backend Integration**: Kết nối với real backend API
2. **Authentication**: JWT tokens, refresh tokens
3. **File Storage**: Upload files lên cloud storage (S3, etc.)
4. **Notifications**: Push notifications cho messages
5. **Group Chats**: Implement group chat feature
6. **Message Reactions**: Thêm reactions cho messages
7. **Typing Indicators**: Hiển thị "user is typing..."
8. **Read Receipts**: Hiển thị message đã đọc chưa
9. **Search**: Search messages, users
10. **Pagination**: Pagination cho messages và employees

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TanStack Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com)

## 👥 Contributors

- Frontend Developer

## 📄 License

Private project

---

**Lưu ý**: Đây là một ứng dụng demo/development. Để sử dụng trong production, cần:
- Setup backend server với Socket.IO
- Setup database cho employees và profile
- Implement authentication & authorization
- Setup file storage cho images/files
- Add error monitoring (Sentry, etc.)
- Add analytics
- Optimize performance
- Security audit
