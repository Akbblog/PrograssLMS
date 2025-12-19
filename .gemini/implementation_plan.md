# School Admin Dashboard - Complete Implementation Plan

## Overview
Complete implementation of the School Admin Dashboard with all missing functionalities for assessments, questions, video courses, learning courses, and core academic management.

## 1. Immediate Bug Fixes

### 1.1 Class Creation 400 Error
- **Issue**: Class creation fails with 400 Bad Request
- **Root Cause**: The `createClassLevelService` requires a valid Admin ID from the database
- **Fix**: Ensure proper admin lookup and add schoolId to class creation for multi-tenancy

### 1.2 404 Errors on Pages
- Review all admin pages for missing routes/components
- Ensure consistent navigation structure

---

## 2. Core Academic Management

### 2.1 Classes Management (Fix Required)
- [x] List all classes
- [x] Create class form (name, description)
- [x] Edit class
- [x] Delete class
- [ ] Fix: Add schoolId to class model for multi-tenancy
- [ ] Fix: Better error handling

### 2.2 Subjects Management
- [x] List all subjects
- [x] Create subject form
- [x] Edit subject
- [x] Delete subject
- [ ] Enhance: Link subjects to classes and teachers

### 2.3 Academic Years & Terms
- [x] CRUD for academic years
- [x] CRUD for academic terms
- [ ] Enhance: Set active year/term

---

## 3. Assessment System (New Feature)

### 3.1 Assessment Types
Backend models needed:
- `AssessmentType`: { name, description, category (exam/quiz/assignment/project), duration, totalMarks, passingMarks, schoolId }
- `Assessment`: { title, assessmentType, subject, class, term, year, questions[], dueDate, instructions, mediaContent[], schoolId }

Frontend features:
- Create assessment type (e.g., "Mid-Term Exam", "Weekly Quiz", "Project")
- Configure: duration, total marks, passing marks
- Assessment scheduling with due dates

### 3.2 Question Bank
Models:
- `Question`: { questionText, questionType (MCQ/short/long/true-false/fill-blank), options[], correctAnswer, marks, difficulty, subject, tags[], mediaContent[], schoolId }

Features:
- Question creation with rich text editor
- Multiple question types:
  - Multiple Choice (MCQ)
  - True/False
  - Short Answer
  - Long Answer/Essay
  - Fill in the Blanks
- Media support (images, videos, YouTube embeds)
- Question tagging and categorization
- Import/Export questions (CSV/JSON)

### 3.3 Video-Based Questions
- Add YouTube link field
- Title for the video
- Auto-embed video player
- Questions linked to video timestamps (optional)

---

## 4. Learning Courses System (New Feature)

### 4.1 Course Structure
Models:
- `Course`: { title, description, thumbnail, subject, class, instructor, modules[], status, enrollments, schoolId }
- `Module`: { title, description, sequence, lessons[], courseId }
- `Lesson`: { title, type (video/pdf/text/quiz), content, duration, sequence, moduleId }

### 4.2 Course Creation Form
Fields:
- Course Title
- Description (rich text)
- Thumbnail image
- Subject (dropdown)
- Target Class(es) (multi-select)
- Instructor (dropdown)
- Course Status (draft/published)

### 4.3 Module & Lesson Management
- Drag-drop ordering
- Lesson types:
  - Video lessons (YouTube embed, file upload)
  - PDF documents
  - Text/HTML content
  - Embedded quizzes
- Progress tracking per student

---

## 5. Video Courses Enhancement

### 5.1 Current Video Course Page
- Already has basic structure
- Needs: YouTube embedding, playlists, progress tracking

### 5.2 Enhancements
- Playlist creation
- Video chapters/timestamps
- Completion certificates
- Student watch history

---

## 6. Exams Management

### 6.1 Backend (Existing)
- `Exam` model exists
- Basic CRUD operations

### 6.2 Frontend Enhancements
- Exam creation wizard
- Assign to classes
- Set schedule
- Import questions from question bank
- Auto-grading for MCQ
- Result generation

---

## 7. Reports Dashboard

### 7.1 Report Types
- Student performance reports
- Class performance analytics
- Attendance reports
- Fee collection reports
- Teacher workload reports

### 7.2 Visualizations
- Charts (bar, line, pie)
- Exportable data (PDF, Excel)

---

## 8. Implementation Priority

### Phase 1: Bug Fixes (Today)
1. Fix class creation 400 error
2. Fix any 404 errors
3. Ensure all core pages load properly

### Phase 2: Core Enhancements (This Week)
1. Complete Classes/Subjects forms
2. Enhance dashboard stats
3. Improve exams page

### Phase 3: New Features (Next Week)
1. Assessment Types CRUD
2. Question Bank
3. Learning Courses structure

### Phase 4: Advanced Features
1. Video embeds and media
2. Reports with charts
3. Advanced scheduling

---

## 9. Files to Create/Modify

### Backend
- `/models/Academic/AssessmentType.model.js` (new)
- `/models/Academic/Question.model.js` (new)
- `/models/Academic/Course.model.js` (new)
- `/models/Academic/Module.model.js` (new)
- `/models/Academic/Lesson.model.js` (new)
- `/controllers/academic/assessment.controller.js` (new)
- `/controllers/academic/course.controller.js` (new)
- `/services/academic/assessment.service.js` (new)
- `/services/academic/course.service.js` (new)
- `/routes/v1/academic/assessment.router.js` (new)
- `/routes/v1/academic/course.router.js` (new)

### Frontend
- `/app/admin/academic/assessments/page.tsx` (enhance)
- `/app/admin/academic/assessments/create/page.tsx` (new)
- `/app/admin/academic/questions/page.tsx` (new)
- `/app/admin/academic/learning-courses/page.tsx` (enhance)
- `/app/admin/academic/learning-courses/create/page.tsx` (new)
- `/app/admin/exams/page.tsx` (enhance)
- `/app/admin/reports/page.tsx` (enhance)

---

## 10. Database Schema Updates

### AssessmentType
```javascript
{
  name: String,           // "Mid-Term Exam", "Weekly Quiz"
  description: String,
  category: String,       // exam, quiz, assignment, project
  defaultDuration: Number, // in minutes
  defaultTotalMarks: Number,
  defaultPassingMarks: Number,
  schoolId: ObjectId,
  createdBy: ObjectId,
  isActive: Boolean
}
```

### Question
```javascript
{
  questionText: String,
  questionType: String,   // mcq, true-false, short, long, fill-blank
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,  // for non-MCQ
  marks: Number,
  difficulty: String,     // easy, medium, hard
  subject: ObjectId,
  tags: [String],
  media: [{
    type: String,         // image, video, youtube
    url: String,
    title: String
  }],
  schoolId: ObjectId,
  createdBy: ObjectId
}
```

### Course
```javascript
{
  title: String,
  description: String,
  thumbnail: String,
  subject: ObjectId,
  classLevels: [ObjectId],
  instructor: ObjectId,
  modules: [ObjectId],
  status: String,         // draft, published, archived
  enrolledStudents: [ObjectId],
  schoolId: ObjectId,
  createdBy: ObjectId
}
```

### Module
```javascript
{
  title: String,
  description: String,
  sequence: Number,
  lessons: [ObjectId],
  course: ObjectId
}
```

### Lesson
```javascript
{
  title: String,
  type: String,           // video, pdf, text, quiz
  content: {
    videoUrl: String,     // YouTube or file URL
    pdfUrl: String,
    htmlContent: String,
    quizId: ObjectId
  },
  duration: Number,       // in minutes
  sequence: Number,
  module: ObjectId
}
```
