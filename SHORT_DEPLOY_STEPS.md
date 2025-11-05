# Quick Vercel Deployment Steps

## 1. Add Environment Variables

Copy these 4 variables to Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_0uEjNs8KcrAC@ep-crimson-dust-a1b681f6-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=eyGKCj9rsCnUjeztAOPraaTthrwNYYqsDWheybX311Q=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Deploy

```bash
vercel login
vercel
```

## 3. Update URLs

After first deployment, update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL, then:

```bash
vercel --prod
```

## 4. Done! ✅

Your app is live. Checkout works with COD-only mode.

---

**Note:** Razorpay keys are NOT required. App works without them.

