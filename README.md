# Stud Pay

Stud Pay is a full-stack web application designed to facilitate secure, fast, and reliable payments of student dues for the Higher Technical Teachers' Training College (HTTC). It features a streamlined student-facing checkout portal and a robust administrative backend.

## Features

- **Student Payment Portal**: An intuitive interface where students can input their details (Name, Matricule, Department, Level) and securely pay their dues.
- **Seamless Stripe Integration**: Secure payment processing utilizing Stripe Payment Intents and Elements.
- **Dynamic Data Management**: Departments, reference levels, and minimum payment limits are all dynamically managed and fetched via the database.
- **Automated Webhooks**: Stripe webhooks are handled automatically to reliably update payment references to `COMPLETED` or `FAILED` without relying purely on client-side confirmation.
- **Admin API**: Protected backend routes (via JWT) allowing administrators to configure system settings, view transaction histories, and manage the student registry.
- **Docker Support**: Easy deployment using Docker Compose for development and production environments.

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Payment Processing**: Stripe Elements (`@stripe/react-stripe-js` & `@stripe/stripe-js`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) (`@prisma/client`)
- **Payment Integration**: Stripe Node.js SDK
- **Security**: JWT for Authentication, `bcrypt` for password hashing, `cors` configured.
- **Language**: TypeScript (`ts-node-dev` for development)

## Project Structure

```text
studPay/
├── docker-compose.yaml       # Docker Compose configuration
├── backend/                  # Node.js / Express API
│   ├── Dockerfile            # Backend Docker configuration
│   ├── entrypoint.sh         # Docker entrypoint script
│   ├── prisma/               # Database schema & migrations
│   │   ├── schema.prisma     # Prisma Data Models
│   │   ├── seed.ts           # Database seeding script
│   │   └── migrations/       # Database migrations
│   ├── src/
│   │   ├── controllers/      # Route handlers (Auth, Payment, Webhooks, etc.)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # JWT verification and Error handling
│   │   ├── config/           # Environment and App config
│   │   └── server.ts         # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # React SPA
    ├── Dockerfile            # Frontend Docker configuration
    ├── src/
    │   ├── api/              # Fetch wrappers for API communication
    │   ├── components/       # Reusable React components (e.g., CheckoutForm)
    │   ├── lib/              # Library wrappers (e.g., Stripe initialization)
    │   ├── pages/            # Page components (e.g., PayScreen)
    │   ├── index.css         # Global styles & Tailwind entry
    │   └── main.tsx          # React application entry point
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
```
    │   ├── components/       # Reusable React components (e.g., CheckoutForm)
    │   ├── lib/              # Library wrappers (e.g., Stripe initialization)
    │   ├── pages/            # Page components (e.g., PayScreen)
    │   ├── index.css         # Global styles & Tailwind entry
    │   └── main.tsx          # React application entry point
    ├── vite.config.ts
    └── package.json
```

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended) - for local development
- [PostgreSQL](https://www.postgresql.org/download/) - for local database
- [Docker](https://www.docker.com/get-started) - for containerized deployment
- A [Stripe](https://stripe.com/) Account (for API keys and Webhook secrets)

### Option 1: Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd studPay
   ```

2. Create environment files:
   
   **Backend (.env)**:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Configure the following variables in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://username123:password123@db:5432/mydb123"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   JWT_SECRET="your_jwt_secret_here"
   ```
   
   **Frontend (.env)**:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Configure the following variables in `frontend/.env`:
   ```env
   VITE_API_URL="http://studpaybackend:3001/api"
   VITE_STRIPE_PUBLIC_KEY="pk_test_..."
   ```

3. Start all services:
   ```bash
   docker-compose up --build
   ```
   
   This will start:
   - PostgreSQL database on port 5432
   - Adminer (database management UI) on port 8080
   - Backend API on port 3001
   - Frontend on port 5173

4. Access the application:
   - Frontend: http://localhost:5173
   - Adminer: http://localhost:8080 (login with db credentials)

### Option 2: Local Development

#### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Update the values in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/studpay"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   JWT_SECRET="your_jwt_secret_here"
   ```

4. Set up the Database:
   ```bash
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   
   # Seed the database (optional)
   npm run prisma:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will start on `http://localhost:3001`.

#### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL="http://localhost:3001/api"
   VITE_STRIPE_PUBLIC_KEY="pk_test_..."
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

#### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL="http://localhost:3001/api"
   VITE_STRIPE_PUBLIC_KEY="pk_test_..."
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Database Seeding

The application comes with a seed script that populates the database with:

- **Departments**: 15 academic departments (Biology, Computer Science, Mathematics, etc.)
- **Levels**: Student levels (100, 200, 300, 400, 500, 600)
- **School Year**: Current academic year (2025/2026)
- **Admin Settings**: Minimum payment amount (3500 XAF)
- **Admin User**: Default admin account (username: `httc@admin2025`, password: `httcpay2025`)

To run the seed script:
```bash
cd backend
npm run prisma:seed
```

## API Endpoints

### Public Endpoints
- `GET /api/references/departments` - Get all departments
- `GET /api/references/levels` - Get all levels
- `GET /api/references/minimum-amount` - Get minimum payment amount
- `POST /api/payments` - Create payment intent

### Admin Endpoints (JWT Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/payments/filter` - Get filtered payments
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings` - Update admin settings

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Payment Workflow

1. **Initialization**: A student fills out their information and amount on the frontend.
2. **Intent Creation**: The frontend sends a request to the backend with the payment details. The backend creates a `Payment` record in the database (status `PENDING`), communicates with Stripe to create a `PaymentIntent`, and returns the `client_secret` to the frontend.
3. **Client-side Confirmation**: The frontend utilizes Stripe Elements to securely collect card details and confirm the payment directly with Stripe using the `client_secret`.
4. **Webhook Fulfillment**: Upon successful charge, Stripe dispatches a `payment_intent.succeeded` webhook event to the backend. The backend securely verifies the webhook signature and updates the corresponding database `Payment` record status to `COMPLETED`.

## Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:seed` - Seed the database

#### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Management

```bash
# View database in browser
npx prisma studio

# Create and apply migrations
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset
```

## Deployment

### Using Docker Compose

1. Set up production environment variables
2. Run:
   ```bash
   docker-compose up -d --build
   ```

### Manual Deployment

1. Build and start the backend:
   ```bash
   cd backend
   npm run build
   npm run start
   ```

2. Build and serve the frontend:
   ```bash
   cd frontend
   npm run build
   npm run preview  # or serve with nginx/apache
   ```

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret
- `JWT_SECRET` - Secret for JWT token signing

### Frontend
- `VITE_API_URL` - Backend API base URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.
