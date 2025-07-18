# CampusFlow

CampusFlow is a comprehensive college management platform designed to streamline academic and administrative processes for students and teachers. It features robust attendance tracking, assignment management, session scheduling, and secure authentication, all within a modern, responsive web interface. Built as a monorepo, CampusFlow ensures scalability and maintainability for multi-role campus operations.

## Features

- **Role-Based Dashboards**: Distinct interfaces for students and teachers.
- **Attendance Management**: Calendar and overview components for tracking and visualizing attendance.
- **Assignment Workflow**: Upload, view, and manage assignments and submissions with file support.
- **Session Scheduling**: Tools for adding, viewing, and managing academic sessions.
- **Notes Section**: Collaborative note sharing and viewing.
- **Authentication**: Secure sign-in and sign-up flows using NextAuth.
- **Data Visualization**: Charts and graphs for insights using Recharts.
- **File Storage**: Integrated EdgeStore for efficient file management.
- **Responsive UI**: Built with Tailwind CSS and Framer Motion.
- **Toast Notifications**: Real-time feedback using React Toastify.

## Tech Stack

**Frontend**
- Next.js (React)
- Tailwind CSS
- Framer Motion
- Lucide React (icons)
- React Toastify
- Recharts

**Backend**
- Next.js API routes
- NextAuth (authentication)
- EdgeStore (file storage)
- Zod (validation)

**Database**
- Prisma ORM
- PostgreSQL

**Monorepo & Tooling**
- Turborepo (monorepo management)
- Prettier (code formatting)
- ESLint (linting)
- Day.js (date handling)
- Axios (HTTP requests)
- bcrypt (password hashing)

**Deployment**
- Vercel (recommended for Next.js apps)
- Render, Railway (optional for backend/database)

## Installation & Setup

```sh
# 1. Clone the repository
git clone https://github.com/sujalkyal/CampusFlow.git
cd CampusFlow

# 2. Install dependencies from the root
npm install

# 3. Set up environment variables
# Copy the example env file and fill in values (e.g., DATABASE_URL, NEXTAUTH_SECRET, etc.)
cp .env.example .env
# Open and edit the .env file as needed

# 4. Navigate to the database package and set up env + install dependencies
cd packages/db

# Copy environment variables to this directory too (if required by Prisma here)
cp .env.example .env

# Install dependencies in the db package
npm install

# Run Prisma migration and generate client
npx prisma migrate dev --name init
npx prisma generate

# 5. Go back to root directory
cd ../../

# 6. Run the development server
npm run dev

# 7. (Optional) Build for production
npm run build
```

## Usage

1. **Access the App**: Open the student or teacher app in your browser (`/apps/student` or `/apps/teacher`).
2. **Authentication**: Sign up or sign in using your credentials.
3. **Student Dashboard**: View attendance, upcoming sessions, assignments, and notes.
4. **Teacher Dashboard**: Schedule sessions, manage assignments, view submissions, and share notes.
5. **Demo Access**: If demo credentials are available, use:
   - **Student**: `ayanroy@gmail.com` / `12345`
   - **Teacher**: `ishu@gmail.com` / `12345`

## Deployment

CampusFlow is optimized for deployment on [Vercel](https://vercel.com/) for seamless Next.js hosting. You can also deploy the backend and database on platforms like Render or Railway. For Prisma migrations, ensure your PostgreSQL database is accessible and environment variables are set.

- **Vercel**: [https://vercel.com/](https://vercel.com/)
- **Render**: [https://render.com/](https://render.com/)
- **Railway**: [https://railway.app/](https://railway.app/)
- **Live Demo**: [Teacher-App](https://campusflow-teacher.vercel.app/) [Student-App](https://ecomm-user-app.vercel.app/)

## Author

**Sujal Kyal**
GitHub: [@sujalkyal](https://github.com/sujalkyal)

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions, feedback, or support:

- Website: [sujalkyal.dev.in](https://sujaldev-ten.vercel.app/)
- Email: sujalkyal.dev@gmail.com