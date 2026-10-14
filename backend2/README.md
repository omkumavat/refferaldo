# Referly Employee Referral Marketplace — Backend

Production-style single-service REST API using Node.js, Express, MongoDB/Mongoose and JWT authentication.

## 1. Installation

Requirements: Node.js 18+ and MongoDB 6+ (local or MongoDB Atlas).

```bash
npm install
```

Create `.env` from `.env.example` and set a strong `JWT_SECRET`.

## 2. Environment

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/referly
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
NODE_ENV=development
```

Never commit `.env`.

## 3. Run

```bash
npm run dev
```

Production:

```bash
npm start
```

Seed demo data:

```bash
npm run seed
```

Health check: `GET /health`

## 4. Seed credentials

- Admin: `nikhil.admin@referly.dev` / `Admin@2026Secure`
- Company HR: `hr1@referly.dev` / `Company@2026Secure`
- Employee: `employee1@referly.dev` / `Employee@2026Secure`
- Candidate: `candidate1@referly.dev` / `Candidate@2026Secure`

Change/delete these credentials before any non-demo deployment.

## 5. Authentication

Login/register sets a JWT in an HTTP-only `accessToken` cookie. Browser clients must send credentials (`credentials: 'include'`). The API also accepts `Authorization: Bearer <JWT>` for clients that cannot use cookies.

Logout clears the cookie. JWT payload contains only user id and role.

Email verification uses a short-lived token stored hashed in MongoDB. No verification token is returned by the API. A real email provider should be connected to the email-service boundary before production; in development the generated token is emitted to the server process for local testing only.

Password reset also uses a short-lived hashed token and the same email-delivery boundary.

## 6. Roles

- `candidate`: browse active jobs, apply, maintain profile/resume, request referrals, view recommendations.
- `employee`: must have an active, verified Employee relationship; can accept/reject referral requests and submit referrals.
- `company`: company account owner; can manage its company and jobs.
- `admin`: platform administration and verification.

Employees do not control recruitment decisions. Company-side recruitment status is controlled by company users/admins through the referral status endpoints.

## 7. API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users` (admin)
- `DELETE /api/users/account`

### Companies
- `POST /api/companies`
- `GET /api/companies`
- `GET /api/companies/:id`
- `PUT /api/companies/:id`
- `DELETE /api/companies/:id`
- `POST /api/companies/:id/verify` (admin)
- `GET /api/companies/:id/employees`
- `POST /api/companies/:id/employees`
- `DELETE /api/companies/:id/employees/:userId`
- `GET /api/companies/:id/jobs`

### Jobs
- `POST /api/jobs`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `PATCH /api/jobs/:id/status`

Filters: `page`, `limit`, `search`, `location`, `workMode`, `employmentType`, `experience`, `company`, `skills`.

### Candidates
- `GET /api/candidates` (company/admin)
- `PUT /api/candidates/profile`
- `POST /api/candidates/resume` (`multipart/form-data`, field `resume`)
- `GET /api/candidates/applications`
- `GET /api/candidates/referrals`
- `POST /api/candidates/jobs/:jobId/apply`
- `POST /api/candidates/jobs/:jobId/referral-request`
- `GET /api/candidates/recommended-jobs`
- `GET /api/candidates/jobs/:jobId/match`

### Employees
- `GET /api/employees/dashboard`
- `GET /api/employees/jobs`
- `GET /api/employees/referral-requests`
- `GET /api/employees/referral-requests/:id`
- `POST /api/employees/referral-requests/:id/accept`
- `POST /api/employees/referral-requests/:id/reject`
- `POST /api/employees/referrals`
- `GET /api/employees/referrals`
- `GET /api/employees/rewards`

### Company referral management
- `GET /api/company/referrals`
- `GET /api/company/referrals/:id`
- `PATCH /api/company/referrals/:id/status`
- `GET /api/company/referrals/analytics`

For admin, `?company=<id>` can select the company context for these company-level referral endpoints.

### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Admin
- `GET /api/admin/users`
- `GET /api/admin/companies`
- `GET /api/admin/jobs`
- `GET /api/admin/referrals`
- `PATCH /api/admin/companies/:id/verify`
- `PATCH /api/admin/employees/:id/verify`
- `PATCH /api/admin/jobs/:id/status`

## 8. Response format

Success:
```json
{"success":true,"message":"Job created","data":{}}
```

List:
```json
{"success":true,"data":[],"pagination":{"page":1,"limit":20,"total":100,"totalPages":5}}
```

Error:
```json
{"success":false,"message":"Validation failed","errors":[{"field":"email","message":"Invalid value"}]}
```

## 9. Resume uploads

Allowed types: PDF, DOC, DOCX. Maximum size: 5 MB. Uploaded files are stored under `UPLOAD_DIR` and are never executed. The API does not parse or execute uploaded document content.

For production, use object storage and a malware/document scanning pipeline before making resumes downloadable.

## 10. Authorization model

Authorization is derived from the authenticated user and MongoDB relationships. Frontend-provided role/company/employee ownership values are not trusted. Verified employee access requires an `Employee` relationship with matching company, `employmentStatus=active`, and `verificationStatus=verified`.

## 11. AI boundary

`services/aiService.js` contains the mock interface:

- `parseResume()`
- `parseJobDescription()`
- `calculateJobMatch()`
- `generateJobRecommendations()`
- `generateResumeSummary()`

Replace the internals with OpenAI, Gemini, Claude or another provider without moving AI logic into controllers.

## 12. Postman

The repository includes `Referly.postman_collection.json` with the main API requests and variables.
