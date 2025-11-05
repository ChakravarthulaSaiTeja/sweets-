# Deployment Guide - Kotaiah's Sweets & Foods

Complete deployment guide for Vercel with Neon Postgres.

## Quick Deployment Steps

### 1. Add Environment Variables

Copy these 4 variables to Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_0uEjNs8KcrAC@ep-crimson-dust-a1b681f6-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=eyGKCj9rsCnUjeztAOPraaTthrwNYYqsDWheybX311Q=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** Generate a new `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

### 2. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

### 3. Update URLs After First Deployment

After deployment, you'll receive a production URL. Update these in Vercel:

1. **NEXTAUTH_URL**: Change to `https://your-app.vercel.app`
2. **NEXT_PUBLIC_APP_URL**: Change to `https://your-app.vercel.app`
3. **Redeploy**: Run `vercel --prod`

### 4. Verify Deployment

- ✅ Visit: `https://your-app.vercel.app`
- ✅ Test checkout: `/checkout` (should show only COD)
- ✅ Test database: `/api/debug/db` returns `{"db": "connected", "products": 11}`
- ✅ Test admin: `/admin` (sign in as admin)

---

## Detailed Deployment Information

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | ✅ Yes |
| `NEXTAUTH_URL` | Your app URL (update after first deploy) | ✅ Yes |
| `NEXTAUTH_SECRET` | Authentication secret (generate with `openssl rand -base64 32`) | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL (update after first deploy) | ✅ Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key (optional, for online payments) | ❌ No |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret (optional, for online payments) | ❌ No |

### Pre-Deployment Checklist

- [x] Razorpay is lazy-loaded (no build-time imports)
- [x] Razorpay keys are optional (not required for build)
- [x] Checkout page shows only COD option
- [x] Payment API routes handle missing Razorpay gracefully
- [x] `npm run build` completes successfully
- [x] No TypeScript errors

### Post-Deployment Verification

- [ ] Application loads without errors
- [ ] Checkout page shows only COD option
- [ ] Orders can be created successfully
- [ ] Database connection works (Neon Postgres)
- [ ] Admin panel accessible
- [ ] `/api/debug/db` returns `{"db": "connected", "products": 11}`

### Troubleshooting

#### Database Connection Fails
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Neon dashboard to ensure database is running
- Verify connection string format is correct

#### Admin Redirects to Sign-In
- Verify `NEXTAUTH_URL` is set to production domain (not localhost)
- Check that user role is "ADMIN" in database
- Verify session is being created correctly

#### Build Fails with Razorpay Error
- This should not happen - Razorpay is now initialized lazily
- If it does, ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in Vercel

---

## Optional: Enable Razorpay Later

When ready to enable online payments:

1. Add Razorpay keys to Vercel environment variables:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

2. Uncomment Razorpay code in:
   - `src/app/checkout/page.tsx` (payment method selection)

3. Redeploy

---

**Ready for deployment!** 🚀

