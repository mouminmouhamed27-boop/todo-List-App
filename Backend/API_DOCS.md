# Todo API v2

## التشغيل

- `npm install`
- شغّل MongoDB محليًا أو غيّر `MONGODB_URI` في `todo-api/.env` إلى رابط Atlas.
- `npm run dev`
- افتح `http://localhost:3000`

## Auth

### POST /auth/register
```json
{"name":"Momen","email":"momen@gmail.com","password":"12345678"}
```
يرجع `accessToken` ويعمل تسجيل دخول مباشرة.

### POST /auth/login
```json
{"email":"momen@gmail.com","password":"12345678"}
```
يرجع `accessToken`.

## Protected Tasks

أرسل كل طلب إلى `/todos` مع:
`Authorization: Bearer <accessToken>`

- `GET /todos` — مهام المستخدم الحالي فقط.
- `GET /todos/:id` — ينجح فقط إذا كانت المهمة مملوكة للمستخدم الحالي.
- `POST /todos` — الـ backend يأخذ `userId` من الـ JWT، ولا تقبل الـ API `userId` من العميل.
- `PATCH /todos/:id` — يحدّث فقط مهمة المستخدم الحالي.
- `DELETE /todos/:id` — يحذف فقط مهمة المستخدم الحالي.

## Health

`GET /api/health`
