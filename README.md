# Smart Attendance Platform

A modern, feature-rich attendance management system built with Next.js, MySQL, and real-time QR code scanning.

## 🚀 Quick Start (Windows)

### Prerequisites
1. **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop/)

### Installation Steps

1. **Clone and Install Dependencies**
   \`\`\`cmd
   git clone <your-repo-url>
   cd smart-attendance-platform
   npm install
   \`\`\`

2. **Install Additional Database Dependencies**
   \`\`\`cmd
   npm install mysql2 @types/mysql2 bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken ts-node
   \`\`\`

3. **Start Docker Desktop**
   - Open Docker Desktop application
   - Wait for it to fully start (Docker icon in system tray should be green)

4. **Set Up Database**
   \`\`\`cmd
   npm run db:setup
   \`\`\`
   This will:
   - Start MySQL container
   - Create database and tables
   - Insert sample data
   - Start phpMyAdmin

5. **Test Database Connection**
   \`\`\`cmd
   npm run db:test
   \`\`\`

6. **Start the Application**
   \`\`\`cmd
   npm run dev
   \`\`\`

## 🌐 Access Points

- **Application**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306

## 🔑 Default Login Credentials

### Admin Access
- **Email**: `admin@smartattend.com`
- **Password**: `admin123`

### Student Access
- **Email**: `john.doe@klu.ac.in`
- **Password**: `student123`

### phpMyAdmin Access
- **Username**: `root`
- **Password**: `rootpassword123`

## 📋 Available Commands

\`\`\`cmd
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:setup     # Set up database (first time)
npm run db:start     # Start database services
npm run db:stop      # Stop database services
npm run db:test      # Test database connection
\`\`\`

## 🛠️ Database Management

### Start Database Services
\`\`\`cmd
npm run db:start
\`\`\`

### Stop Database Services
\`\`\`cmd
npm run db:stop
\`\`\`

### Reset Database (if needed)
\`\`\`cmd
docker-compose down -v
npm run db:setup
\`\`\`

## 🔧 Troubleshooting

### Docker Issues
1. **Docker not running**: Start Docker Desktop and wait for it to be ready
2. **Port conflicts**: Make sure ports 3306 and 8080 are not in use
3. **Permission issues**: Run Command Prompt as Administrator

### Database Connection Issues
1. **Connection refused**: Wait 30 seconds after starting Docker containers
2. **Authentication failed**: Check if containers are running with `docker ps`
3. **Database not found**: Run `npm run db:setup` again

### Application Issues
1. **Module not found**: Run `npm install` again
2. **Environment variables**: Check if `.env.local` file exists
3. **Port 3000 in use**: Use `npm run dev -- -p 3001` for different port

## 📁 Project Structure

\`\`\`
smart-attendance-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── user/              # User dashboard
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities and database
│   ├── models/           # Database models
│   └── database.ts       # Database connection
├── scripts/              # Database setup scripts
├── docker-compose.yml    # Docker configuration
└── package.json          # Dependencies
\`\`\`

## 🎯 Features

✅ **Real-time QR Code Scanning**
✅ **MySQL Database Integration**
✅ **User Authentication & Authorization**
✅ **Admin Dashboard with Analytics**
✅ **Student Dashboard with QR Codes**
✅ **Attendance Tracking & Reports**
✅ **Excel Export Functionality**
✅ **ACM Membership Management**
✅ **Responsive Design**
✅ **Dark/Light Mode Support**

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection protection
- Input validation and sanitization
- Role-based access control

## 📊 Database Schema

The application uses MySQL with the following main tables:
- `users` - Student and admin information
- `subjects` - Course/subject management
- `attendance` - Attendance records
- `qr_codes` - QR code tracking
- `password_reset_tokens` - Password reset functionality

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure Docker Desktop is running
3. Verify all dependencies are installed
4. Check the console for error messages

For additional help, please check the application logs or contact support.
