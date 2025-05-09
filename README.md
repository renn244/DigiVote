
# DigiVote

DigiVote is meant to serve stiers (student from STI) and staff from sti to have easier time voting an election in their respective branches. only admins can make an admin accounts. that can create poll. and then eligible students can vote on it. this is for easier voting for independent sti branches.

![Admin Dashboard](https://res.cloudinary.com/dxocuabaq/image/upload/v1738739531/sti-voting/website/unbsankefa91m7skrgaw.jpg)

## Features
- Authentication with email otp to verify if truly from STI
- Admin Dashboard for important analytical information (per branch and active polls)
- Admin User Management (admin can change information and password about user)
- Admin Election, Position, Parties and Candidates CRUD
- User's ability to vote and view their vote and vote history
- Help Center where they would ask for help on community or check FAQ's

## Tech Stack
This is the technology that i used for building this application

**Frontend**

![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCn](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)

**Backend**

![Nest Js](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Node Js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)


## Installation

### Development

In the development environment you need to have two terminals open one for the frontend and one for the backend

**1st terminal**
```powershell
    npm run install
    cd frontend 
    npm run dev
```

**2nd terminal**
```powershell
    cd backend
    npm run start:dev
```

### Production
In here you would only need 1 terminal

**Build**
```powershell
    npm run build
```

**Start**
```powershell
    npm run start
```
