# Slå på videouppladdning (3 minuter)

Företag kan lägga upp en video på sin annons. För att **fil-uppladdning** ska
fungera på din livesajt behöver du slå på Vercels videolagring ("Blob"). Det är
gratis att börja och funkar precis som databasen du redan kopplat.

> Tills du gjort detta kan företag fortfarande lägga in en video genom att
> **klistra in en videolänk** – men för att kunna ladda upp en filmad video
> direkt behövs steget nedan.

## Steg 1 – Skapa en Blob-store i Vercel

1. Gå till **vercel.com** och klicka in på ditt projekt **olleanal08**.
2. Klicka på fliken **"Storage"** högst upp.
3. Klicka **"Create Database"** (eller "Create").
4. Välj **"Blob"**.
5. Klicka **"Create"** / **"Continue"** och bekräfta att den kopplas till
   projektet **olleanal08**.

Det lägger automatiskt in nyckeln `BLOB_READ_WRITE_TOKEN` åt dig – du behöver
inte skriva något själv.

## Steg 2 – Starta om sidan

1. Gå till fliken **"Deployments"** i ditt projekt.
2. Klicka på de tre prickarna **"⋯"** på översta raden → **"Redeploy"** →
   bekräfta.
3. Vänta ungefär en minut.

Klart! Nu kan företag ladda upp en video direkt när de skapar en annons, och
videon spelas upp i jobbflödet.

---

## Bra att veta

- Videor får vara upp till **100 MB** (en kort mobilfilm är oftast 10–30 MB).
- Korta, vertikala klipp (10–20 sek) ser bäst ut i flödet.
- Saknas Blob-store funkar fortfarande "klistra in en videolänk".
