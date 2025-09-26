# 🏗️ Dashboard App Architecture (Next.js App Router + shadcn)

## 1. High-Level Structure

* **Root Layout** → global providers, theming, metadata.
* **Auth Segment** → login/register/reset pages (public).
* **Dashboard Segment** → protected pages (role-based), shared shell (sidebar, header).
* **API Routes** → pagination + search support, role checks at backend.

---

## 2. Folder Layout

```plaintext
src/
  app/
    layout.tsx                  # Root layout
    page.tsx                    # Landing page (public)

    (auth)/
      login/page.tsx            # Unified login page

    (dashboard)/
      layout.tsx                 # Dashboard shell (sidebar + header)
      page.tsx                   # Dashboard home (role-based)

      # Admin-only
      teachers/
        page.tsx                 # List teachers (create modal here)
        [id]/
          page.tsx               # Teacher details (edit/delete modal here)

      # Teacher-only
      students/
        page.tsx                 # List students (pagination, search, create modal)
        upload/page.tsx          # Batch upload students (CSV)
        [id]/
          page.tsx               # Student details (edit/delete modal here)
          marks/
            page.tsx             # List marks for this student (read-only, no batch upload)

      exams/
        page.tsx                 # List exams
        [examId]/
          page.tsx               # Exam details (with marks summary, edit exam info)
          upload/page.tsx        # Batch upload marks for this exam (CSV)

      # Student-only
      profile/page.tsx           # Student profile (edit modal → approval flow)
      exams/
        page.tsx                 # List exams for student
        [examId]/page.tsx        # Marks for that exam
```

---

## 3. Auth & Role Management

* **JWT issued by backend** → contains `{ id, username, role }`.
* **Stored in cookie** (httpOnly, secure).
* **Frontend context/provider** reads user from cookie/session.
* **Role-based logic** decides:

  * Sidebar menu items.
  * Which routes/components to render.
  * Redirects if user doesn’t have access.

---

## 4. Sidebar & Navigation

* Central **config file** defining menu items per role.
* Dashboard layout consumes config → renders sidebar based on role.
* Same routes, different visibility depending on role.

---

## 5. List Views (Generic Pattern)

* **API contract** always supports:

  * `page` (number)
  * `pageSize` (number)
  * `search` (string)
* **Response** includes:

  * `data` (rows)
  * `total` (count)
  * `page` & `pageSize`
* **Frontend component** handles:

  * Input (debounced search).
  * Table/List rendering.
  * Pagination controls.

---

## 6. API Layer

* Routes under `/api/...`.
* Each route:

  * Auth check (via middleware or wrapper).
  * Role check (allowedRoles array).
  * Database query with pagination + search.
  * JSON response with data + total count.

---

## 7. Layout Responsibilities

* **Root Layout (`/app/layout.tsx`)**

  * Global styles, theme provider, auth provider.
* **Auth Layout (`/app/(auth)/layout.tsx`)**

  * Minimal shell (centered card, branding).
* **Dashboard Layout (`/app/(dashboard)/layout.tsx`)**

  * Role-based sidebar + header.
  * Shared dashboard styling.

---

## 8. Access Control

* **Middleware / API handler**: validates token, attaches user.
* **Route-level checks**:

  * If user lacks required role → redirect/403.
  * If unauthenticated → redirect to login.

---

## 9. Extensibility

* Adding a new role → update sidebar config + role check.
* Adding a new module → create new route under `(dashboard)` and hook into config.
* Pagination + search component is **reusable** across modules.

---

✅ This is your **blueprint**:

* One login for all users.
* One dashboard shell, role decides content.
* One list-view pattern, used everywhere with search + pagination.

---

## 10. Pages

### 10.1 Landing Page

* Should have some content in the main page related to the student management system
* A login button, which redirects to login page. This should also be there in all pages, it should change to logout if already logged in.
* Theme toggle button. -> This should be there in all pages.

### 10.2 Login Page

* Should be a very simple username password login page.

### 10.3 List view component

* Already done.

### 10.4 Dashboard SideBar

* This is also done already, if you want change it to requirements.
* Should contain module names from config, which has the role based items.

### 10.5 Teacher Dashboard page

* There is a teacher dashboard which is already done, Change that. 
* The home page should be having some welcome, role, username stuff.
* Sidebar should have the modules.

### 10.6 Student Dashboard page

* The student dashboard home should have similar stuff: "Welcome, Name".
* Sidebar should have the modules.

---
