# Student Marks Dashboard

## Development

If you want to develop.

```bash
# install dependencies
npm i

# prisma migrations
npx prisma migrate dev

# prisma initial user
npm run seed

# run the development server
npm run dev
```

### DATABASE_URL for local postgres

```.env
DATABASE_URL=postgresql://postgres@localhost:5432/mydb?schema=public
```

## TODO

### BACKEND

- [x] create the schema for user, and queries -> this should handle the auth alone.
- [x] create the schema for student, and queries -> to store the information about the student.
- [x] create the schema for marks, and queries -> to store and retrieve the marks
- [x] api routes -> /api/auth/login, /api/auth/logout, /api/auth/me
- [x] implement authentication for the api routes.
- [x] csv batch processor -> upload Marks
- [x] csv batch processor -> upload students
- [ ] list jobs endpoint
- [ ] delete blobs by teacher
- [ ] search functionality for listview
  - [x] for exams list
  - [ ] for students list
  - [ ] for teachers list

**ADMIN(All these should be secret frontend routes)**
- [x] create teacher route.
- [x] delete teacher.
- [x] edit teacher.
- [x] show all teachers.

**TEACHER**
- [x] implement upload student details route -> batch , single.
- [x] implement upload marks route -> batch, single
- [x] list students route.
  - [x] pagination for this?
- [x] edit student route.
- [x] delete single student route.
- [x] delete multiple students route.

**STUDENT**
- [x] list exams for that student. (will have marks for all that exams).


### FRONTEND

- [x] Landing page -> Sample content, login button, theme toggle.
- [x] Change login page -> only have username and password, not go to separate teacher or student contexts.
- [x] Have only one dashboard route, but have multiple stuffs like teacherDashboard.tsx, studentDashboard.tsx.
        After logging in, u will get the role from the backend. Use that role to choose which dashboard to show.
- [x] Have sidebar, which has items based on roles. Have a cental config for that, and choose the items to show for each role.
- [x] Teacher Dashboard.
  - [x] List students view. #BACKEND_DONE
    - [x] pagination -> 10 students per page. (query when going to that page).
  - [ ] Upload student marks (single) -> I think I can have this as an action in list view??. #BACKEND_DEPENDENCY
  - [x] Upload student marks (batch). #BACKEND_DEPENDENCY
  - [x] View a single student.
    - [x] should be able to edit or delete marks for that student.
    - [ ] approve student edits on their profile. -> #NOT_NOW
    - [x] Create multiple students.
    - [x] Create single student.
    - [x] Edit student.
    - [x] Delete student (with confirmation).
- [x] Student Dashboard
  - [x] Student details
    - [ ] Edit profile and send to teacher to approve. -> #NOT_NOW
  - [x] List all exams available.
  - [x] Marks for an exam.
  - [x] Mark changes -> main feature.

### BATCH PROCESSOR ARCHITECTURE

**FRONTEND**
1. Ask backend for file url in vercel blob.
2. Upload the file in the vercel blob.
3. Acknowledge file is uploaded to vercel blob to backend.
4. Show the status, manual refresh needed to know if it is success or failed.

**BACKEND**
1. Create an url for the file in vercel blob.
2. Expose another route for acknowledgement?? or get through websocket or something.
3. After acknowledgement, queue a job, add it to db.

**WORKER**
1. The processing logic should be -> take some max amount of rows from the uploaded csv through a redis stream or something.
2. Call the appropriate next.js backend endpoint, and update the status for each worker.
3. When a worker takes the last values from the csv, delete the csv.
