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


## TODO

### BACKEND

- [x] create the schema for user, and queries -> this should handle the auth alone.
- [x] create the schema for student, and queries -> to store the information about the student.
- [x] create the schema for marks, and queries -> to store and retrieve the marks
- [x] api routes -> /api/auth/login, /api/auth/logout, /api/auth/me
- [x] implement authentication for the api routes.
- [ ] csv batch processor, generic to any endpoint. (upload student details, upload marks).
**TEACHER**
- [ ] implement upload student details route -> batch , single.
- [ ] implement upload marks route
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
