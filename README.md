# Stud Pay

Stud Pay is a full-stack web application designed to facilitate secure, fast, and reliable payments of student dues for the Higher Technical Teachers' Training College (HTTC). It features a streamlined student-facing checkout portal and a robust administrative backend.

##  Features

- **Student Payment Portal**: An intuitive interface where students can input their details (Name, Matricule, Department, Level) and securely pay their dues.
- **Seamless Stripe Integration**: Secure payment processing utilizing Stripe Payment Intents and Elements.
- **Dynamic Data Management**: Departments, reference levels, and minimum payment limits are all dynamically managed and fetched via the database.
- **Automated Webhooks**: Stripe webhooks are handled automatically to reliably update payment references to `COMPLETED` or `FAILED` without relying purely on client-side confirmation.
- **Admin API**: Protected backend routes (via JWT) allowing administrators to configure system settings, view transaction histories, and manage the student registry.

##  Tech Stack

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

##  Project Structure

```text
httcPay/
├── backend/                  # Node.js / Express API
│   ├── prisma/               # Database schema & migrations
│   │   └── schema.prisma     # Prisma Data Models
│   ├── src/
│   │   ├── controllers/      # Route handlers (Auth, Payment, Webhooks, etc.)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # JWT verification and Error handling
│   │   ├── config/           # Environment and App config
│   │   └── server.ts         # Application entry point
│   └── package.json
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── api/              # Axios/Fetch wrappers for API communication
    │   ├── assets/           # Static assets (Images, logos)
    │   ├── components/       # Reusable React components (e.g., CheckoutForm)
    │   ├── lib/              # Library wrappers (e.g., Stripe initialization)
    │   ├── pages/            # Page components (e.g., PayScreen)
    │   ├── index.css         # Global styles & Tailwind entry
    │   └── main.tsx          # React application entry point
    ├── vite.config.ts
    └── package.json
```

##  Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running
- A [Stripe](https://stripe.com/) Account (for API keys and Webhook secrets)

### 1. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory based on your setup:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/httcpay"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   JWT_SECRET="your_jwt_secret_here"
   ```
4. Setup the Database:
   Sync your Prisma schema with the database and generate the Prisma Client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```
   *(Optional)* If you have a seed script provided in `prisma/seed.ts`:
   ```bash
   npm run prisma:seed
   ```
5. Start the Development Server:
   ```bash
   npm run dev
   ```
   The backend API will start running (default: `http://localhost:5000`).

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   VITE_STRIPE_PUBLIC_KEY="pk_test_..."
   ```
4. Start the Development Server:
   ```bash
   npm run dev
   ```
   The frontend application will start running (default: `http://localhost:5173`).

##  Payment Workflow

1. **Initialization**: A student fills out their information and amount on the frontend.
2. **Intent Creation**: The frontend sends a request to the backend with the payment details. The backend creates a `Payment` record in the database (status `PENDING`), communicates with Stripe to create a `PaymentIntent`, and returns the `client_secret` to the frontend.
3. **Client-side Confirmation**: The frontend utilizes Stripe Elements to securely collect card details and confirm the payment directly with Stripe using the `client_secret`.
4. **Webhook Fulfillment**: Upon successful charge, Stripe dispatches a `payment_intent.succeeded` webhook event to the backend. The backend securely verifies the webhook signature and updates the corresponding database `Payment` record status to `COMPLETED`.
