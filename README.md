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
- [ ] csv batch processor -> upload Marks
- [x] csv batch processor -> upload students

**ADMIN(All these should be secret frontend routes)**
- [ ] create teacher route.
- [ ] delete teacher.
- [ ] edit teacher.
- [ ] show all teachers.

**TEACHER**
- [x] implement upload student details route -> batch , single.
- [ ] implement upload marks route -> batch, single
- [x] list students route.
  - [x] pagination for this?
- [ ] edit student route.
- [x] delete single student route.
- [x] delete multiple students route.

**STUDENT**
- [x] list exams for that student. (will have marks for all that exams).


### FRONTEND

- [x] Landing page -> role selection, theme toggle.
- [x] Teacher login page.
- [x] Student login page.
- [ ] Teacher Dashboard.
  - [ ] List students view. #BACKEND_DONE
    - [ ] pagination -> 10 students per page. (query when going to that page).
  - [ ] Upload student marks. -> single or batch. #BACKEND_DEPENDENCY
  - [ ] View a single student.
    - [ ] should be able to edit or delete marks for that student.
    - [ ] approve student edits on their profile. -> #NOT_NOW
    - [ ] Create students. -> single, batch.
    - [ ] Edit student (with confirmation).
    - [ ] Delete student (with confirmation).
- [ ] Student Dashboard
  - [ ] Student details
    - [ ] Edit profile and send to teacher to approve. -> #NOT_NOW
  - [ ] List all exams available.
  - [ ] Marks for an exam.

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
