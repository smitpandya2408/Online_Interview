# InterviewOS — Online Interview Platform

Company-ready online interviews with real-time video, collaborative coding, and structured evaluation.

## Getting Started

1. **Environment variables**

   Create a `.env.local` file in the root and add your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/` – Next.js App Router pages and API routes
- `components/` – Reusable UI components
- `lib/` – Utilities, database connection, and models
- `public/` – Static assets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new?filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
