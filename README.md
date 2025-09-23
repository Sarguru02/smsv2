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

#run the development server
npm run dev
```


## TODO

### BACKEND

- [x] create the schema for user, and queries -> this should handle the auth alone.
- [x] create the schema for student, and queries -> to store the information about the student.
- [x] create the schema for marks, and queries -> to store and retrieve the marks
- [x] api routes -> /api/auth/login, /api/auth/logout, /api/auth/me
- [x] implement authentication for the api routes.
- [ ] implement upload csv route.
- [ ] batch process the csv, and insert them into the table.

### FRONTEND

- [x] Landing page -> role selection, theme toggle.
- [x] Teacher login page
- [x] Student login page
- [ ] Teacher Dashboard
  - [ ] List students view.
  - [ ] Upload student marks.
  - [ ] View a single student.
- [ ] Student Dashboard
  - [ ] Student details
  - [ ] List all exams available.
  - [ ] Marks for an exam.
