# Todo API — Documentation

REST API لإدارة قائمة مهام (To-Do). البيانات مخزّنة في الذاكرة (in-memory)، يعني بترجع لقيمها الافتراضية كل ما تعمل restart للسيرفر.

**Base URL:** `http://localhost:3000`

**Content-Type:** كل الـ requests و الـ responses بصيغة `application/json`.

---

## شكل الـ Todo object

```json
{
  "id": 1,
  "title": "Learn Node.js",
  "completed": false
}
```

| الحقل      | النوع    | الوصف                              |
|------------|----------|-------------------------------------|
| id         | number   | معرف فريد، بيتولّد تلقائيًا         |
| title      | string   | نص المهمة                          |
| completed  | boolean  | حالة الإنجاز (افتراضيًا `false`)   |

---

## شكل الاستجابة العام

### نجاح
```json
{
  "success": true,
  "data": { ... }
}
```

### فشل
```json
{
  "success": false,
  "message": "وصف الخطأ"
}
```

---

## Endpoints

### 1. جلب كل المهام
`GET /todos`

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Learn Node.js", "completed": false },
    { "id": 2, "title": "Learn Express", "completed": false }
  ]
}
```

---

### 2. جلب مهمة واحدة
`GET /todos/:id`

**Params:** `id` — رقم المهمة

**Response `200 OK`:**
```json
{ "success": true, "data": { "id": 1, "title": "Learn Node.js", "completed": false } }
```

**Response `404 Not Found`:**
```json
{ "success": false, "message": "Todo not found" }
```

---

### 3. إضافة مهمة جديدة
`POST /todos`

**Body:**
```json
{ "title": "Buy milk" }
```

**Response `201 Created`:**
```json
{ "success": true, "data": { "id": 4, "title": "Buy milk", "completed": false } }
```

**Response `400 Bad Request`** (لو الـ title فاضي أو مش موجود):
```json
{ "success": false, "message": "Title is required and must be a non-empty string" }
```

---

### 4. تعديل مهمة
`PATCH /todos/:id`

**Body (أي حقل منهم اختياري):**
```json
{ "title": "Buy almond milk", "completed": true }
```

**Response `200 OK`:**
```json
{ "success": true, "data": { "id": 4, "title": "Buy almond milk", "completed": true } }
```

**Response `404 Not Found`:**
```json
{ "success": false, "message": "Todo not found" }
```

---

### 5. حذف مهمة
`DELETE /todos/:id`

**Response `200 OK`:**
```json
{ "success": true, "data": { "id": 4, "title": "Buy almond milk", "completed": true } }
```

**Response `404 Not Found`:**
```json
{ "success": false, "message": "Todo not found" }
```

---

## أمثلة cURL

```bash
curl http://localhost:3000/todos

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'

curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

curl -X DELETE http://localhost:3000/todos/1
```

---

## ملاحظات تقنية

- تم إضافة **CORS middleware** (`cors` package) في `app.js` عشان الفرونت اند (اللي شغال على origin مختلف زي `file://` أو `localhost:5500`) يقدر يعمل requests للـ API من غير ما يتحظر.
- الـ `PORT` بقى بيتقرأ من `process.env.PORT` مع fallback لـ `3000`، يعني تقدر تظبطه من ملف `.env`.
- مفيش قاعدة بيانات حقيقية — البيانات بترجع لقيمها الافتراضية عند إعادة تشغيل السيرفر. لو عايز تخزين دائم، الخطوة الجاية المنطقية هي ربط MongoDB أو SQLite.
