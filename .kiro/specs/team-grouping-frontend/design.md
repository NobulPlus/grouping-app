# Design Document: Team Grouping Frontend

## Overview

This document describes the technical design for a Next.js frontend application that provides an engaging team member registration and group visualization experience. The application uses React 19, Next.js 16, TailwindCSS for styling, React Hook Form for form management, and Framer Motion for animations.

## Architecture

### Technology Stack

- **Framework**: Next.js 16 (Pages Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Application Structure

```
frontend/src/
├── pages/
│   ├── index.tsx              # Landing/Home page
│   ├── register.tsx           # Registration form
│   ├── confirm.tsx            # Registration confirmation
│   ├── dashboard.tsx          # All groups dashboard
│   └── group/[id].tsx         # Individual group view
├── components/
│   ├── forms/
│   │   ├── NameInputField.tsx
│   │   └── NameSelectField.tsx
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── Header.tsx
│   ├── shared/
│   │   ├── GroupCard.tsx
│   │   ├── MemberCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── LoadingSpinner.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── lib/
│   ├── api.ts                 # API client configuration
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Utility functions
└── hooks/
    ├── useRegistration.ts
    ├── useGroups.ts
    └── useGroupMembers.ts
```

## Components and Interfaces

### Core Data Types

```typescript
interface User {
  id: string;
  surname: string;
  firstName: string;
  middleName: string;
  email?: string;
  phone?: string;
  group: string;
  groupName: string;
  groupColor: string;
  groupColorCode: string;
  registrationDate: string;
}

interface Group {
  _id: string;
  name: string;
  color: string;
  colorCode: string;
  currentCount: number;
  maxCapacity?: number;
  isActive: boolean;
  order: number;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      group: string;
      groupColor: string;
      groupColorCode: string;
      positionInGroup: number;
      totalInGroup: number;
      registrationDate: string;
    };
    assignment: {
      groupId: string;
      groupName: string;
      groupColor: string;
      groupColorCode: string;
    };
  };
}

interface Stats {
  totalUsers: number;
  todayRegistrations: number;
  weeklyRegistrations: number;
  averagePerDay: string;
}
```

### Page Components

#### 1. Home Page (index.tsx)
- Hero section with application title and description
- Call-to-action button to start registration
- Quick stats display (total members, groups)
- Visual representation of the four groups with colors

#### 2. Registration Page (register.tsx)
- Form with three name fields (surname, firstName, middleName)
- Toggle between dropdown selection and text input
- Real-time validation feedback
- Submit button with loading state
- Link to check existing registration

#### 3. Confirmation Page (confirm.tsx)
- Large group color display with animation
- Member's full name
- Group assignment details (position in group, total members)
- Confetti or celebration animation
- Navigation buttons to view group members or all groups

#### 4. Dashboard Page (dashboard.tsx)
- Grid layout showing all four groups
- Each group card displays: name, color, member count
- Statistics panel with overall metrics
- Search/filter functionality
- Expandable group cards to show member previews

#### 5. Group Detail Page (group/[id].tsx)
- Group header with color and name
- Paginated list of all group members
- Member cards with names and registration dates
- Back button to dashboard

### Reusable Components

#### GroupCard Component
```typescript
interface GroupCardProps {
  group: Group;
  onClick?: () => void;
  showMembers?: boolean;
}
```
- Displays group name, color swatch, and member count
- Clickable to navigate to group detail
- Animated hover effects

#### MemberCard Component
```typescript
interface MemberCardProps {
  member: User;
  compact?: boolean;
}
```
- Shows member's full name
- Displays registration date
- Avatar with initials
- Group color accent

#### NameInputField Component
```typescript
interface NameInputFieldProps {
  label: string;
  name: string;
  options?: string[];
  mode: 'select' | 'input';
  onModeChange: (mode: 'select' | 'input') => void;
}
```
- Dual-mode input (dropdown or text)
- Validation feedback
- Smooth transition between modes

## Data Models

### API Integration

#### Base API Configuration
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### API Endpoints

1. **POST /api/users/register**
   - Request: `{ surname, firstName, middleName, email?, phone? }`
   - Response: `RegistrationResponse`

2. **GET /api/users/check**
   - Query: `?surname=X&firstName=Y&middleName=Z`
   - Response: `{ exists: boolean, user?: { group, registeredDate } }`

3. **GET /api/groups**
   - Response: `{ success: boolean, groups: Group[] }`

4. **GET /api/groups/:id**
   - Response: `{ success: boolean, group: Group }`

5. **GET /api/users/group/:groupId/members**
   - Query: `?page=1&limit=20`
   - Response: `{ success: boolean, data: { members: User[], pagination } }`

6. **GET /api/users/stats**
   - Response: `{ success: boolean, data: Stats }`

### Form Validation Schema

```typescript
const registrationSchema = z.object({
  surname: z.string()
    .min(1, 'Surname is required')
    .max(50, 'Surname cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Surname can only contain letters and spaces'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  middleName: z.string()
    .min(1, 'Middle name is required')
    .max(50, 'Middle name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Middle name can only contain letters and spaces'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number').optional().or(z.literal('')),
});
```

## Error Handling

### Error Types

1. **Network Errors**: Backend unreachable
2. **Validation Errors**: Invalid form input
3. **Duplicate Registration**: Name already exists
4. **Server Errors**: 500 responses from backend

### Error Handling Strategy

```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Unable to connect to server. Please check your connection.',
      status: 0,
    };
  } else {
    // Other errors
    return {
      message: 'An unexpected error occurred',
      status: -1,
    };
  }
};
```

### User Feedback

- Toast notifications for success/error messages
- Inline validation errors on form fields
- Loading spinners during API calls
- Disabled buttons during submission
- Retry buttons for failed operations

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Name validation accepts only letters and spaces
*For any* string input to name fields, the validation should accept the input if and only if it contains only letters (a-z, A-Z) and spaces.
**Validates: Requirements 1.2**

### Property 2: API check called for all valid name combinations
*For any* valid combination of surname, firstName, and middleName, submitting the form should trigger an API call to check if the name exists.
**Validates: Requirements 1.3**

### Property 3: Registration API called for new users
*For any* new valid name combination (not existing in database), submitting the form should trigger the registration API endpoint.
**Validates: Requirements 1.5**

### Property 4: Dropdown selection populates field
*For any* name selected from a dropdown, the corresponding form field should be populated with that exact value.
**Validates: Requirements 2.2**

### Property 5: Manual input triggers validation
*For any* text manually entered into a name field, the validation function should be called and provide feedback.
**Validates: Requirements 2.3**

### Property 6: Mode switching preserves values
*For any* value entered in a name field, switching between dropdown and text input modes should preserve that value.
**Validates: Requirements 2.4**

### Property 7: Submit enabled with three valid names
*For any* form state where all three name fields contain valid values, the submit button should be enabled.
**Validates: Requirements 2.5**

### Property 8: Group color displayed for all groups
*For any* group assignment response, the confirmation page should display the group's color code as a visual element.
**Validates: Requirements 3.2**

### Property 9: Member information displayed in lists
*For any* member in a group member list, the display should include the member's full name and registration date.
**Validates: Requirements 4.2**

### Property 10: Pagination with more than 20 members
*For any* group with more than 20 members, the member list should display pagination controls and show exactly 20 members per page.
**Validates: Requirements 4.3**

### Property 11: API fetch on group page load
*For any* group page that loads, an API call should be made to fetch the current member data for that group.
**Validates: Requirements 4.5**

### Property 12: Group information displayed on dashboard
*For any* group displayed on the dashboard, the display should include the group name, color, and current member count.
**Validates: Requirements 5.2**

### Property 13: Group click triggers navigation
*For any* group card clicked on the dashboard, the system should navigate to or expand that group's detail view.
**Validates: Requirements 5.3**

### Property 14: Dashboard loads group data
*For any* dashboard page load, API calls should be made to fetch all groups and their member counts.
**Validates: Requirements 5.5**

### Property 15: Stats API called when displaying statistics
*For any* page that displays statistics, an API call should be made to fetch current statistics data.
**Validates: Requirements 6.5**

### Property 16: Responsive layout adaptation
*For any* viewport size change, the layout should adapt by applying appropriate responsive CSS classes.
**Validates: Requirements 7.3**

### Property 17: Color contrast meets accessibility standards
*For any* group color used in the UI, the contrast ratio between the color and its background should meet WCAG AA standards (4.5:1 for text).
**Validates: Requirements 7.4**

### Property 18: Validation errors highlighted
*For any* form field that fails validation, the field should be highlighted and display a specific error message.
**Validates: Requirements 8.2**

### Property 19: Loading indicators during async operations
*For any* asynchronous operation (API call), a loading indicator should be displayed until the operation completes.
**Validates: Requirements 8.4**

### Property 20: Success feedback for completed operations
*For any* successfully completed operation, positive visual feedback should be provided to the user.
**Validates: Requirements 8.5**

### Property 21: Navigation present on all pages
*For any* page in the application, a navigation menu or header should be present in the DOM.
**Validates: Requirements 9.1**

## Testing Strategy

### Unit Tests
- Form validation logic
- Utility functions (name formatting, date formatting)
- Component rendering with different props
- Error handling functions
- Color contrast calculations
- Pagination logic

### Integration Tests
- Form submission flow
- API integration with mock responses
- Navigation between pages
- State management with React Query
- Error boundary behavior

### Property-Based Tests

The testing strategy will use `fast-check` for property-based testing in TypeScript/JavaScript.

Property-based tests will verify universal behaviors across many randomly generated inputs, complementing unit tests which verify specific examples.

Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

Property-based tests will be tagged with comments referencing the specific correctness property from this design document using the format: `**Feature: team-grouping-frontend, Property {number}: {property_text}**`

## Styling and Theming

### Color Palette

```typescript
const groupColors = {
  orange: {
    primary: '#FF6B35',
    light: '#FFB399',
    dark: '#CC5529',
  },
  blue: {
    primary: '#004E89',
    light: '#3D7EA6',
    dark: '#003D6B',
  },
  green: {
    primary: '#00A8E8',
    light: '#4DC4F0',
    dark: '#0086BA',
  },
  purple: {
    primary: '#9D4EDD',
    light: '#C18EF0',
    dark: '#7D3EB0',
  },
};
```

### TailwindCSS Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'group-orange': '#FF6B35',
        'group-blue': '#004E89',
        'group-green': '#00A8E8',
        'group-purple': '#9D4EDD',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
    },
  },
};
```

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic with Next.js)

### Data Fetching
- React Query for caching and background refetching
- Stale-while-revalidate strategy
- Optimistic updates for better UX

### Image Optimization
- Next.js Image component for avatars
- Lazy loading for member lists

### Bundle Size
- Tree-shaking unused code
- Minimize third-party dependencies
- Use dynamic imports for animations

## Accessibility

### WCAG 2.1 AA Compliance

1. **Color Contrast**: Ensure 4.5:1 ratio for text
2. **Keyboard Navigation**: All interactive elements accessible via keyboard
3. **Screen Readers**: Proper ARIA labels and semantic HTML
4. **Focus Indicators**: Visible focus states
5. **Form Labels**: Associated labels for all inputs

### Implementation

```typescript
// Example accessible button
<button
  aria-label="Register for team grouping"
  className="focus:ring-2 focus:ring-offset-2"
>
  Register Now
</button>
```

## Security Considerations

### Input Sanitization
- All user inputs validated on frontend and backend
- XSS prevention through React's built-in escaping
- No direct HTML injection

### API Security
- CORS configured on backend
- Rate limiting on API endpoints
- No sensitive data in localStorage

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

## Deployment Considerations

### Build Process
```bash
npm run build
npm run start
```

### Environment Configuration
- Development: `http://localhost:5050`
- Production: Configure `NEXT_PUBLIC_API_URL` to production backend

### Static Asset Optimization
- Image optimization with Next.js
- Font optimization
- CSS minification

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live member additions
2. **Group Chat**: In-app messaging for group members
3. **Profile Pictures**: Upload and display member photos
4. **Export Functionality**: Download group lists as CSV/PDF
5. **Admin Panel**: Manage groups, rebalance members
6. **Notifications**: Email notifications for group assignments
7. **Gamification**: Badges, achievements for early registration
8. **Multi-language Support**: i18n for different languages
