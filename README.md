# Shopline Zambia

A marketplace app for buying and selling products across Zambia and other African countries.

## Local setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase project values in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## Environment variables

The app expects these variables in the browser:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never commit your real `.env` file.
