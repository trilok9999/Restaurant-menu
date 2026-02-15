# Test Documentation

## Overview

This project uses **Vitest** and **React Testing Library** for unit and integration testing.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

Tests are located next to the components they test in `__tests__` directories:

```
src/
├── components/
│   ├── shared/
│   │   ├── DietaryBadge.jsx
│   │   └── __tests__/
│   │       └── DietaryBadge.test.jsx
│   ├── display/
│   │   ├── MenuItemRow.jsx
│   │   ├── ChefSpecial.jsx
│   │   └── __tests__/
│   │       ├── MenuItemRow.test.jsx
│   │       └── ChefSpecial.test.jsx
│   └── auth/
│       ├── ProtectedRoute.jsx
│       └── __tests__/
│           └── ProtectedRoute.test.jsx
└── pages/
    └── admin/
        ├── Login.jsx
        └── __tests__/
            └── Login.test.jsx
```

## Test Coverage

### Components Tested

#### ✅ DietaryBadge Component
- **File**: `src/components/shared/__tests__/DietaryBadge.test.jsx`
- **Tests**: 8 test cases
- **Coverage**:
  - Renders all dietary badge types (vegetarian, vegan, gluten-free, dairy-free, nut-free)
  - Applies correct styling and colors
  - Handles unknown tags gracefully
  - Displays correct labels and titles

#### ✅ MenuItemRow Component
- **File**: `src/components/display/__tests__/MenuItemRow.test.jsx`
- **Tests**: 8 test cases
- **Coverage**:
  - Displays item name, price, and description
  - Handles optional fields (description, dietary tags)
  - Renders dietary badges correctly
  - Formats prices with 2 decimal places
  - Handles multiple dietary tags

#### ✅ ChefSpecial Component
- **File**: `src/components/display/__tests__/ChefSpecial.test.jsx`
- **Tests**: 9 test cases
- **Coverage**:
  - Displays special item details
  - Renders both regular and special descriptions
  - Shows Chef's Special badge
  - Applies special styling (gradient background)
  - Handles optional special_description field
  - Renders dietary badges

#### ✅ Login Component
- **File**: `src/pages/admin/__tests__/Login.test.jsx`
- **Tests**: 7 test cases
- **Coverage**:
  - Renders login form correctly
  - Handles user input (email, password)
  - Calls signIn with correct credentials
  - Navigates to admin panel on success
  - Displays error messages on failure
  - Shows loading state during authentication
  - Redirects if already logged in

#### ✅ ProtectedRoute Component
- **File**: `src/components/auth/__tests__/ProtectedRoute.test.jsx`
- **Tests**: 4 test cases
- **Coverage**:
  - Shows loading state while authenticating
  - Renders protected content when authenticated
  - Redirects to login when not authenticated
  - Prevents content display during loading

## Mock Setup

### Supabase Mock
- **File**: `src/test/mocks/supabase.js`
- Mocks all Supabase client methods
- Includes auth, database, and storage mocks

### Auth Context Mock
- **File**: `src/test/mocks/AuthContext.jsx`
- Provides mock authentication context
- Used for testing protected components

## Writing New Tests

### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<YourComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(/* expected result */).toBe(true);
  });
});
```

### Best Practices

1. **Arrange-Act-Assert Pattern**
   - Arrange: Set up test data and render component
   - Act: Perform actions (clicks, inputs, etc.)
   - Assert: Verify expected outcomes

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary
   - Makes tests more resilient to changes

3. **Test User Behavior, Not Implementation**
   - Test what users see and do
   - Don't test internal state or implementation details
   - Focus on component output and interactions

4. **Mock External Dependencies**
   - Mock API calls (Supabase)
   - Mock navigation (react-router)
   - Mock context providers

5. **Keep Tests Simple**
   - One assertion per test when possible
   - Clear test names that describe what's being tested
   - Avoid complex setup

## Coverage Goals

Current coverage:
- **Components**: 5 components tested
- **Display Components**: 100% (MenuItemRow, ChefSpecial)
- **Shared Components**: 100% (DietaryBadge)
- **Auth Components**: 100% (ProtectedRoute)
- **Pages**: Partial (Login tested)

### Components Still Need Testing

1. **ItemForm** - Complex form with image upload
2. **ItemLibrary** - CRUD operations page
3. **DailyBuilder** - Drag-and-drop functionality
4. **DailyMenu** - Date selection and publishing
5. **MenuSection** - Category display component
6. **Display** - Main display page

## Integration Testing

For testing components that interact with Supabase:

```javascript
import { mockSupabase } from '../../test/mocks/supabase';

describe('ComponentWithSupabase', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it('fetches data from Supabase', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null
      })
    });

    render(<ComponentWithSupabase />);

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});
```

## Continuous Integration

To add tests to CI/CD:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Ensure all imports use correct paths
   - Check that mocks are in the right location

2. **"Network request failed" in tests**
   - Verify Supabase is properly mocked
   - Check that async operations use `waitFor`

3. **Tests pass locally but fail in CI**
   - Ensure all dependencies are in package.json
   - Check for timezone or environment-specific issues

4. **Router-related errors**
   - Wrap components in `<BrowserRouter>` for routing tests
   - Mock `useNavigate` and `useParams` when needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
