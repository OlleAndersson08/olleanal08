# Koppla på en permanent databas (5 minuter)

Din app fungerar redan med en lokal databas. För att din **publika sida** ska
minnas allt för alla besökare behöver den en permanent molndatabas. Det är
gratis och tar ungefär 5 minuter. Följ stegen exakt.

## Steg 1 – Skapa en gratis databas (Neon)

1. Gå till **neon.tech** i webbläsaren.
2. Klicka **"Sign up"** och logga in med GitHub (samma konto som projektet).
3. Klicka **"Create project"**. Lämna allt som det är och klicka **"Create"**.
4. Nu visas en ruta med en **"Connection string"** – en lång text som börjar
   med `postgresql://`. Klicka på kopiera-knappen bredvid den.
   - Välj den som heter **"Pooled connection"** om du får välja.

## Steg 2 – Klistra in länken i Vercel

1. Gå till **vercel.com** och öppna ditt projekt **olleanol08**.
2. Klicka på fliken **"Settings"** högst upp.
3. Klicka på **"Environment Variables"** i menyn till vänster.
4. I fältet **"Key"** skriver du exakt: `DATABASE_URL`
5. I fältet **"Value"** klistrar du in länken du kopierade från Neon.
6. Klicka **"Save"**.

## Steg 3 – Starta om sidan så den börjar använda databasen

1. Gå till fliken **"Deployments"** i ditt Vercel-projekt.
2. På den översta raden, klicka på de tre prickarna **"⋯"** längst till höger.
3. Klicka **"Redeploy"** och bekräfta med **"Redeploy"** igen.
4. Vänta ungefär en minut.

Klart! Nu sparas konton, ansökningar och annonser permanent för alla besökare.

---

## Hur det fungerar (kort)

- Finns `DATABASE_URL` → appen använder din permanenta Postgres-databas.
- Saknas den → appen använder en lokal databas (bra vid utveckling/test).

Du behöver aldrig röra koden för detta. Allt styrs av `DATABASE_URL`.
