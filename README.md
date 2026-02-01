# Ombor - Sotuvni Boshqaruv Tizimi

Ombor inventori va sotuvlarni boshqarish uchun web-asosida yaratilgan tizim. Roli asosida kirish (Manager va Seller), maxfiylik boshqaruvi, narxlarni boshqaruv, sotuv tarixini saqlash va hisobotlar yaratish imkoniyatlarini o'z ichiga oladi.

## Xususiyatlar

### Umumiy
- 👤 Roli asosida kirish kontroli (Manager/Seller)
- 📱 Responsive veb-interfeys
- 🔐 JWT-asosida autentifikatsiya
- 🔔 Toast bildirishnomalar

### Sotuvchi (Seller)
- 📦 Mahsulot sotinmalarini qo'shish
- 💰 Sotuvni yaratish va savatni boshqarish
- 📜 Sotuv tarixini ko'rish
- 📝 Chekni ko'rish va chop etish

### Menejer (Manager)
- 👥 Foydalanuvchilarni boshqarish (qo'shish/o'chirish)
- 💲 Narxlarni va promosyonlarni boshqarish
- 📊 Davriy hisobotlar va statistika
- 📥 CSV-ga eksport qilish
- ✅ Barcha sotuvchi funktsiyalari

## Texnologiyalar

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT autentifikatsiya
- bcryptjs parol tikilishi

### Frontend
- React 18
- TypeScript
- Vite bundler
- Tailwind CSS
- React Router
- Axios

## O'rnatish

### Talab qilinadigan dasturlar
- Node.js 22.14.0 yoki yuqori
- PostgreSQL 12+ yoki Docker
- npm

### Backend

```bash
cd backend
npm install

# PostgreSQL bilan ishlay boshlash (agar Docker ishlatilsa)
cd ..
docker-compose up -d
cd backend

# Migrations joylash
npx prisma migrate deploy

# Test ma'lumotlari qo'shish (ixtiyoriy)
npm run seed

# Serverini ishga tushirish
npm start
```

Backend `http://localhost:5000` da ishga tushadi.

#### Database konfiguratsiyasi

`.env` faylini yarating:

```env
DATABASE_URL="postgresql://warehouse_user:warehouse_pass@localhost:5432/warehouse_db?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=5000
NODE_ENV=development
```

### PostgreSQL migratsiyasi haqida batafsil

Sinov ma'lumotlarini yuklash va deployment qo'llanmasi uchun [POSTGRESQL_MIGRATION.md](./POSTGRESQL_MIGRATION.md) faylini ko'ring.

Server `http://localhost:5000` da ishga tushadi

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` da ishga tushadi

## Default Hisoblar

| Username | Password   | Rol      |
|----------|-----------|----------|
| admin    | admin123  | Manager  |
| ali      | seller123 | Seller   |

## Mandat

Ombor Inventory System Uzbek shahar sohalarida to'p ishlasa kerak. Ombor boshqaruv funktsiyalarini o'z ichiga olgan tizim sifatida yaratilgan.

## Database Schema

### Jadvallar

- **users**: Foydalanuvchilar (id, name, username, password_hash, role, created_at)
- **products**: Mahsulotlar (id, sku, name, category, unit, is_active, created_at)
- **purchases**: Sotinmalar (id, product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note)
- **pricing_rules**: Narx qoidalari (id, product_id, minimal_price_per_unit, recommended_price_per_unit, promo info...)
- **sales**: Sotuvlar (id, seller_id, sold_at, customer_name, payment_type, total_sum, total_profit)
- **sale_items**: Sotuv mahsulotlari (id, sale_id, product_id, qty, sell_price_per_unit, cost_price_per_unit_snapshot, line_total, line_profit)

## API Yo'llari

### Autentifikatsiya
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Joriy foydalanuvchi

### Mahsulotlar
- `GET /api/products` - Barcha mahsulotlar
- `GET /api/products/:id` - Mahsulot tafsilotlari
- `POST /api/products` - Mahsulot yaratish (Manager)
- `GET /api/products/search/:query` - Mahsulot qidirish

### Sotinmalar
- `POST /api/purchases` - Sotinma qo'shish
- `GET /api/purchases` - Barcha sotinmalar
- `GET /api/purchases/product/:product_id` - Mahsulot sotinmalari

### Sotuvlar
- `POST /api/sales` - Sotuv yaratish
- `GET /api/sales` - Sotuvlar (filtrlash)
- `GET /api/sales/:id` - Sotuv tafsilotlari

### Hisobotlar
- `GET /api/reports/dashboard` - Dashboard statistikasi
- `GET /api/reports/stock-summary` - Qoldiq qo'pollanishi
- `GET /api/reports/period` - Davriy hisobot

### Foydalanuvchilar (Manager)
- `GET /api/users` - Foydalanuvchilar ro'yxati
- `POST /api/users` - Foydalanuvchi yaratish
- `DELETE /api/users/:id` - Foydalanuvchini o'chirish

### Narxlar (Manager)
- `GET /api/pricing/:product_id` - Narx qoidalari
- `PUT /api/pricing/:product_id` - Narx qoidalarini o'zgartirish

## Asosiy Xususiyatlar

### Sotuv Jarayoni
1. Mahsulotni qidiring va savatga qo'shing
2. Miqdor va narxni o'zgartirib sotuv niyatini o'rnating
3. Eng past narxdan pastda sotuv mumkin emas (xato ko'rsatiladi)
4. Sotuv yopildi - chek yaratiladi
5. Chekni chop etish yoki PDF sifatida eksport qilish

### Ombor Boshqaruvi
1. Sotinma qo'shish (mahsulot, miqdor, narx, rashot)
2. Avtomatik qoldiq hisoblash
3. Sotuv tarixini ko'rish
4. Davri hisoboti

### Narx Boshqaruvi (Manager)
1. Har mahsulot uchun eng past narx belgilash
2. Tavsiy narx belgilash
3. Promosyon (foiz yoki soʻm)
4. Promosyon vaqti

## Seed Ma'lumotlar

Tizim ishga tushganda avtomatik ravishda quyidagi ma'lumotlar yaratiladi:

- 3 ta mahsulot (Samosa, Burinaka, Nan)
- 3 ta sotinma
- 2 ta sotuv

## Ommaviy Qaydlar

### Eng Past Narx Logikasi
```
Eng past narx = xarid narxi + rashot (birga)
```
Sotuvchi bu narxdan pastda sotish mumkin emas.

### Foyda Hisoblash
```
Foyda = (sotuv narxi - xarid narxi) × miqdor
```

### Qoldiq Hisoblash
```
Qoldiq = Jami sotilgan - Jami sotilgan
```

## Sahifalar

### Barcha Foydalanuvchilar
- 🔐 Login - Kirish (admin/admin123, ali/seller123)
- 📊 Dashboard - Bosh sahifa (statistika, tez link)
- 📦 Ombor - Mahsulotlar va sotinmalar
- 💰 Sotuv - Sotuv yaratish (savat)
- 📜 Tarix - Sotuv tarixini ko'rish

### Faqat Manager
- 👥 Foydalanuvchilar - Foydalanuvchilarni boshqarish
- 💲 Narxlar - Narxlar va promosyonlar
- 📊 Hisobotlar - Davriy hisobotlar

## Chekni Chop Etish

Sotuv yaratilgandan keyin chek sahifasi ochiladi va quyidagi o'rnatmalar mavjud:

1. **Chop etish** - Window.print() orqali
2. **PDF** - Brauzer chop siga Print → Save as PDF
3. **Orqaga** - Sotuv sahifasiga qaytish

## Jarayonni Boshlash

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Brauzerda http://localhost:3000 ni oching
# Default hisob: admin / admin123
```

## Tanzim

Backend-da `SECRET_KEY`ni o'zgartirishni tavsiya etamiz `server.js` faylida:

```javascript
const SECRET_KEY = 'your-secret-key-change-in-production';
```

## Muammolarni Bartaraf Etish

### Backend port 5000 egalik
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend port 3000 egalik
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Litsenziya

MIT License

## Muallif

Ombor Inventory System

---

**Izoh**: Bu tizim mustaqil o'rganish va o'sish uchun yaratilgan. Ishchilik muhitda foydalanish uchun xavfsizlik o'zgartirishlari va qo'shimcha hususiyatlar talab qilinadi.
