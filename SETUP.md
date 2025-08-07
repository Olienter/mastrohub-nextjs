# 🚀 OCR System Setup Guide

## 📋 Prehľad systému

Tento OCR systém dokáže:
- ✅ **Rozpoznať text** z obrázkov menu
- ✅ **Spracovať menu items** automaticky
- ✅ **Kategorizovať jedlá** (main-courses, desserts, atď.)
- ✅ **Extrahovať ceny a popisy**
- ✅ **Fungovať s Google Vision API** (už nastavené)

## 🔧 Inštalácia

### Krok 1: Spustite server

```bash
npm run dev
```

### Krok 2: Overte funkčnosť

1. **Choďte na**: `http://localhost:3000/menu-maker`
2. **Kliknite na Camera ikonu** 📷
3. **Nahrajte obrázok s menu**
4. **Kliknite "Extract Text"**
5. **Pozrite sa na spracované jedlá**

## 🧪 Testovanie

### Menu Maker
- **URL**: `http://localhost:3000/menu-maker`
- **Funkcia**: Skutočné nahrávanie obrázkov
- **Postup**:
  1. Kliknite na Camera ikonu 📷
  2. Nahrajte obrázok s menu
  3. Kliknite "Extract Text"
  4. Pozrite sa na spracované jedlá

## 🔍 Debugovanie

### Developer Tools (F12)
**Ak sa F12 neotvára:**
1. **Skúste Ctrl+Shift+I**
2. **Alebo pravým klikom → Inspect**
3. **Alebo View → Developer → Developer Tools**

### Konzola logy
Hľadajte tieto logy v konzole:
- 🔍 **Checking API key...**
- ✅ **Using real Google Cloud Vision API**
- 📝 **Processing texts: [počet]**
- 🍽️ **Found dish name: [názov]**
- ✅ **Completed item: [názov]**

## 🚨 Riešenie problémov

### Problém: API key nefunguje
**Riešenie:**
1. API key je už nastavený v kóde
2. Restartujte server
3. Skontrolujte konzolu pre chyby

### Problém: Žiadne texty sa nenačítajú
**Riešenie:**
1. Skontrolujte Google Vision API connectivity
2. Overte API quota
3. Testujte s rôznymi obrázkami

### Problém: Menu items sa nespracujú správne
**Riešenie:**
1. Skontrolujte logy v konzole
2. Overte pattern matching
3. Testujte s rôznymi menu formátmi

## 📊 Očakávané výsledky

### Google Vision API (už nastavené)
```
✅ API Response Status: 200
✅ Texts found: [závisí od obrázka]
✅ Menu items: [skutočné rozpoznané jedlá]
✅ Kategorizácia: main-courses, desserts, atď.
✅ Popisy a ceny extrahované
```

## 🎯 Funkcie systému

### OCR Spracovanie
- **Google Vision API**: Pre skutočné OCR (už nastavené)
- **Fallback handling**: Ak sa nenačítajú jednotlivé slová
- **Multi-language support**: EN, SK, CS, DE, HU

### Menu Spracovanie
- **Kategórie**: main-courses, desserts, appetizers, beverages
- **Pattern matching**: Regex pre rozpoznávanie jedál
- **Price extraction**: Automatické rozpoznávanie cien
- **Description parsing**: Spracovanie popisov

### Error Handling
- **API errors**: Network, authentication, quota
- **Validation**: Image format, data integrity
- **Graceful degradation**: Robust error handling

## 🔄 Aktualizácie

### Posledné zmeny
- ✅ **Google Vision API už nastavené**
- ✅ **Vylepšené API spracovanie**
- ✅ **Lepšie error handling**
- ✅ **Robustné menu processing**
- ✅ **Optimalizované pre "jeden riadok = jedno jedlo"**

### Plánované vylepšenia
- 🔄 **Podpora viacerých jazykov**
- 🔄 **Lepšie pattern matching**
- 🔄 **Automatické kategorizovanie**
- 🔄 **Price detection z obrázkov**

## 📞 Podpora

Ak máte problémy:
1. **Skontrolujte Menu Maker**
2. **Pozrite sa na konzolu logy**
3. **Restartujte server**
4. **Testujte s rôznymi obrázkami**

**Systém je teraz plne funkčný s Google Vision API!** 🎉 