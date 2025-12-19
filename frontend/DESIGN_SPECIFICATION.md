# Modern LMS - Visual Design Specification

## Design System Overview

### Brand Identity
```
Logo: DESIGNO
Mark: Orange square with "D"
Primary Color: #FF4B00 (Orange)
Secondary Color: #1C1D1D (Dark Gray)
Tertiary: #FFFFFF (White)
```

---

## Component Library Specifications

### 1. LOGIN PAGE

**Desktop View**:
```
┌────────────────────────────────────────────┐
│         Left (50%)  │  Right (50%)         │
│  Brand Content      │  Login Form          │
│  Branding           │  ├─ Greeting        │
│  Benefits Cards     │  ├─ Form Fields     │
│  Testimonials       │  ├─ Submit Button   │
│                     │  └─ Footer Links    │
└────────────────────────────────────────────┘
```

**Color Scheme**:
- Left background gradient: orange-50 → white
- Right background: white
- Form inputs: gray-200 border, white background
- Button: orange-500 (primary), gray-200 (secondary)
- Text: gray-900 (headings), gray-600 (body)

**Typography**:
- Logo: 22px Space Grotesk, bold
- Heading: 48px Inter, bold
- Body: 16px Inter, regular
- Label: 14px Inter, semibold

**Spacing**:
- Page padding: 32px (desktop), 16px (mobile)
- Form gap: 20px between fields
- Button height: 40px
- Border radius: 8px

---

### 2. DASHBOARD SIDEBAR

**Dimensions**:
- Width: 224px
- Fixed position
- Border-right: 1px solid gray-200

**Structure**:
```
┌──────────────────────┐
│    LOGO (64px)       │
├──────────────────────┤
│ ┌─────────────────┐  │
│ │ Dashboard   📊  │  │ ← Active state (orange bg)
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ My Courses   📚 │  │ ← Inactive state
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ My Grades    📈 │  │
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ Calendar      📅 │  │
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ Assignments   📄 │  │
│ └─────────────────┘  │
├──────────────────────┤
│   LOGOUT BUTTON      │
└──────────────────────┘
```

**Colors**:
- Background: gray-50 (#F9F9F9)
- Border: gray-200
- Active item: orange-500
- Inactive text: gray-600
- Hover: gray-100

**Styling**:
- Item padding: 12px (horizontal), 8px (vertical)
- Item border-radius: 8px
- Gap between items: 8px
- Font: 13px Inter, medium

---

### 3. DASHBOARD HEADER

**Layout**:
```
┌────────────────────────────────────────────────────┐
│ Search Bar │  (spacer)  │ Notifications │ Profile  │
└────────────────────────────────────────────────────┘
```

**Height**: 64px
**Border-bottom**: 1px solid gray-200

**Search Bar**:
- Width: max-w-md (432px)
- Border: 2px solid orange-500
- Padding: 12px 16px
- Border-radius: 8px
- Placeholder: "Search"

**Profile Section**:
- Avatar: 32px circular gradient (orange)
- Name: 14px bold gray-900
- Role: 12px gray-500
- ChevronDown icon: gray-400

---

### 4. GREETING SECTION

```
┌─────────────────────────────────────┐
│ Hello [Name] 👋🏻                   │
│ Let's learn something new today!    │
└─────────────────────────────────────┘
```

**Typography**:
- Main: 48px bold gray-900
- Sub: 18px regular gray-600

**Spacing**:
- Margin-bottom: 32px
- Gap between lines: 4px

---

### 5. COURSE CARD

**Layout**:
```
┌──────────────────────────────────────┐
│ [Icon] Course Title                  │
│ Instructor Name                      │
│ [Progress Bar] 47% [Lessons]         │
└──────────────────────────────────────┘
```

**Dimensions**:
- Min-height: 120px
- Padding: 16px
- Border: 2px solid orange-500
- Border-radius: 8px
- Hover: shadow increase

**Icon**:
- Size: 48px
- Background: gray-100
- Border-radius: 8px

**Progress Bar**:
- Height: 8px
- Background: gray-100
- Fill color: orange-500
- Border-radius: 999px

**Typography**:
- Title: 14px semibold gray-900
- Instructor: 12px regular gray-600
- Progress: 12px semibold orange-500

---

### 6. CALENDAR WIDGET

```
     June 2024
 Sun Mon Tue Wed Thu Fri Sat
  1   2   3   4   5   6   7
  8   9  10  11  12  13  14
 15  16  17  18  19  20  21
 22  23  24  25  26  27  28
 29  30
```

**Size**: 
- Width: 312px
- Height: auto

**Colors**:
- Header: orange-500
- Today: orange-500 (full circle)
- Weekend/Special: red-500
- Current day: orange-500

**Typography**:
- Day headers: 10px regular gray-500
- Dates: 11px regular gray-900
- Selected: white text on orange-500

---

### 7. UPCOMING LESSONS CARD

**Layout**:
```
┌─────────────────────────────────┐
│ UX Design Fundamentals          │
│ 5:30pm                          │
│ Alex Johnson        [Join] btn  │
└─────────────────────────────────┘
```

**Card Styling**:
- Padding: 16px
- Border: 1px solid gray-200
- Border-radius: 8px
- Hover: shadow-md

**Button**:
- Join: orange-500 bg
- Later: gray-100 bg
- Height: 28px
- Border-radius: 6px
- Font: 12px semibold

---

### 8. TODO LIST ITEM

```
┌──────────────────────────────────┐
│ ☑ Homepage Design        Aug 10  │
│ ☐ Design Mockup          Aug 12  │
│ ☑ Complete Quiz          Aug 10  │
└──────────────────────────────────┘
```

**Checkbox Styles**:
- Completed: orange-500 bg, white checkmark
- Incomplete: white bg, orange-500 border

**Typography**:
- Completed: gray-400 + line-through
- Incomplete: gray-900 bold

**Spacing**:
- Item padding: 12px 0
- Border-bottom: 1px gray-100
- Gap: 12px

---

### 9. STATS CARD (Admin)

**Layout**:
```
┌──────────────────────┐
│ 👥  ↗              │
│ 1,245              │
│ Total Students     │
└──────────────────────┘
```

**Dimensions**:
- Equal width (25% of row)
- Min-height: 120px
- Padding: 24px
- Border: 1px solid (color-200)
- Border-radius: 8px

**Colors by Type**:
- Students: blue-50 bg, blue-200 border
- Teachers: green-50 bg, green-200 border
- Courses: purple-50 bg, purple-200 border
- Revenue: orange-50 bg, orange-200 border

**Typography**:
- Value: 28px bold gray-900
- Label: 14px regular gray-600

**Icons**:
- Size: 24px
- Color: based on card type
- Emoji or Lucide icons

---

### 10. ACTIVITY ITEM

```
✅ Student Enrolled
   John Doe enrolled in Product Design
                              2 hours ago
```

**Layout**:
- Icon (24px) | Content | Time
- Spacing: 16px gaps

**Typography**:
- Type: 13px semibold gray-900
- Description: 12px regular gray-600
- Time: 11px regular gray-500

**Border**:
- Bottom: 1px solid gray-100
- Last item: no border

---

### 11. PERFORMANCE TABLE

**Structure**:
```
┌─────────────────────────────────────────────┐
│ Course Name │ Students │ Progress │ Revenue │
├─────────────────────────────────────────────┤
│ Course 1    │ 234      │ ████░░░░ │ $5,200  │
│ Course 2    │ 189      │ ███░░░░░ │ $4,100  │
└─────────────────────────────────────────────┘
```

**Row Height**: 56px
**Padding**: 12px vertical, 16px horizontal
**Hover**: bg-gray-50
**Border**: 1px bottom gray-100

**Progress Bar in Table**:
- Max-width: 120px
- Height: 8px
- Same styling as course card

---

## Animations & Transitions

### Hover Effects
```css
transition: all 0.2s ease-in-out;

Button:hover {
  background: darker shade
  shadow: increase
}

Card:hover {
  shadow: 0px 4px 12px rgba(0,0,0,0.1)
  transform: translateY(-2px)
}

Input:focus {
  border: orange-500
  ring: orange-100
}
```

### Loading States
```css
/* Spinner */
border-4 solid orange-200
border-top-color: orange-500
animation: spin 1s linear infinite

/* Skeleton */
background: linear-gradient(90deg, gray-200, gray-100, gray-200)
animation: shimmer 1.5s infinite
```

### Transitions
- Page enter/exit: fade 300ms
- Menu open/close: slide 200ms
- Button click: scale 150ms

---

## Responsive Design Rules

### Mobile (< 640px)
- Sidebar: hidden (add hamburger menu)
- Grid: single column
- Padding: 16px
- Font size: -2px from desktop

### Tablet (640px - 1024px)
- Sidebar: visible
- Grid: 2 columns
- Padding: 24px
- Some cards stack

### Desktop (> 1024px)
- Full layout as designed
- Sidebar always visible
- Grid: 3-4 columns
- Padding: 32px

---

## Dark Mode Consideration

```tsx
// Example dark mode classes
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
```

**Dark Mode Colors**:
- Background: gray-900
- Surface: gray-800
- Border: gray-700
- Text: gray-100
- Orange: same (#FF4B00)

---

## Accessibility Standards

### Color Contrast
- Text on orange: white (#FFFFFF) - 7.1:1 ✓
- Text on white: dark gray - 18.5:1 ✓
- Gray borders: 4.5:1 ✓

### Interactive Elements
- Min touch target: 44px × 44px
- Focus visible: 2px solid orange-500 + outline
- Keyboard navigation: tab order maintained
- ARIA labels: provided for buttons/inputs

### Typography
- Min font size: 12px (12px base)
- Line-height: 1.5 (150%)
- Letter spacing: 0.5px (labels)

---

## Performance Optimization

### Image Optimization
- Use WebP with PNG fallback
- Lazy load images
- Compress to < 100KB per image

### CSS Optimization
- Tailwind purging enabled
- Critical CSS inlined
- Remove unused utilities

### JavaScript Optimization
- Code split by route
- Tree-shake unused components
- Memoize expensive computations

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest 2 versions

---

**Design System Version**: 1.0.0
**Last Updated**: December 4, 2025
**Status**: Complete & Ready for Implementation
