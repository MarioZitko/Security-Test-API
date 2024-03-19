# Security Test API

Security Test API je web aplikacija dizajnirana za automatizirano testiranje sigurnosnih ranjivosti web API-ja, s fokusom na OWASP Top 10 ranjivosti. Projekt kombinira moć Flask-a za backend logiku i React-a za interaktivno korisničko sučelje.

## Značajke

- **Automatizirano Testiranje Ranjivosti:** Podržava detekciju ključnih sigurnosnih ranjivosti definiranih u OWASP Top 10.
- **Interaktivno Korisničko Sučelje:** Omogućava korisnicima jednostavno upravljanje testovima i pregled rezultata.
- **Prilagodljivi Testovi:** Korisnici mogu odabrati specifične ranjivosti koje žele testirati.

## Početak rada

Da biste lokalno pokrenuli projekt, slijedite upute ispod.

### Preduvjeti

- Python (verzija 3.x)
- Node.js i npm

### Postavljanje Projekta

1. **Kloniranje Repozitorija**
```
git clone https://github.com/MarioZitko/Security-Test-API.git
cd Security-Test-API
```

2. **Postavljanje i Aktivacija Virtualnog Okruženja**
```
python -m venv venv
```

**Na Windowsu**
```
venv\Scripts\activate
```

**Na Unixu ili MacOS-u**
```
source venv/bin/activate
```

3. **Instalacija Backend Ovisnosti**
```
cd backend
pip install -r requirements.txt
```

4. **Pokretanje Flask Aplikacije**
```
flask run
```

5. **Instalacija Frontend Ovisnosti**
U novom terminalu/tabu:
```
cd frontend
npm install
```

6. **Pokretanje React Aplikacije**
```
npm start
```
Aplikacija bi trebala biti dostupna na `http://localhost:3000`, dok je Flask API dostupan na `http://localhost:5000`.

## Korištenje Aplikacije

- Otvorite web preglednik i posjetite `http://localhost:3000`.
- Unesite URL API-ja koji želite testirati i odaberite vrste ranjivosti za testiranje.
- Pregledajte rezultate i preporuke za mitigaciju otkrivenih ranjivosti.

## Licenca

Ovaj projekt je licenciran pod MIT Licencom - pogledajte [LICENSE.md](LICENSE.md) datoteku za detalje.

Projektni Link: [https://github.com/MarioZitko/Security-Test-API](https://github.com/MarioZitko/Security-Test-API)
