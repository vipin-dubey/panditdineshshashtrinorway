# Pandit Dinesh Shastri - Vedic Priest & Astrologer in Norway

A modern, culturally authentic, bilingual (English & Hindi) static website for **Pandit Dinesh Shastri**, offering Vedic Indian Astrology and Hindu priestly services across Norway (Oslo, Bergen, Stavanger, Trondheim, Drammen, Kristiansand, and nationwide) as well as online globally.

## Features

- **Rich Vedic Hindu Aesthetics**: Authentic saffron (`#E65100`), Suvarna gold (`#D4AF37`), and kumkum maroon (`#7E1222`) color palette, custom pure SVGs (Om ॐ, Kalash, Diya, Swastika, Mandala, Vedic Janam Kundali diagram).
- **Vedic Typography**: Google Fonts (`Rozha One`, `Cinzel Decorative`, `Noto Serif Devanagari`, `Plus Jakarta Sans`).
- **Comprehensive Service Catalog**:
  1. **Karmkand - 16 Sanskar**: Interactive tabbed showcase covering all 16 life milestones (Garbhadhana, Namakarana, Annaprashana, Mundan, Janeu, Vivaha, Antyeshti) with detailed modal popups.
  2. **Katha & Anushthan**: Shri Satyanarayan Bhagwan Katha, Sundarkand, Hanuman Chalisa Anushthan, and Shiv Rudrabhishek.
  3. **Grih Pravesh & Vastu**: Mangal Pravesh, Vastu Shanti, Navagraha Havan, and Nordic smoke-safe apartment guidance.
  4. **Vedic Astrology**: Janam Kundali making (D1 & D9 Navamsha), 36 Gun Milan for marriage, Manglik Dosha analysis, and Nordic latitude Muhurat calculations.
- **Bilingual Support (English Default & Hindi)**: Instant real-time language switcher (`EN | हिन्दी`) without page reload, saved in `localStorage`.
- **Inquiry & Booking Form**:
  - Sends booking requests to **`dineshshastri82@gmail.com`** via FormSubmit AJAX.
  - Dynamic fields: Automatically reveals birth details (Date of Birth, Time of Birth, Place of Birth) when Astrology/Kundali services are chosen.
  - Direct WhatsApp fallback button generating a formatted booking message to **`+47 97335299`**.
- **Legal Compliance Pages**:
  - `privacy.html`: GDPR and Norwegian Data Protection Act (Personopplysningsloven) compliant.
  - `terms.html`: Transparent terms on bookings, rescheduling, and traditional Dakshina.
- **Vercel Ready**: Includes `vercel.json` with clean URLs, security headers, and caching optimizations.

## File Structure

```
pandiji/
├── index.html              # Main Landing Page
├── contact.html            # Dedicated Contact & Booking Page
├── privacy.html            # Privacy Policy (GDPR / Norwegian Law compliant)
├── terms.html              # Terms & Conditions
├── vercel.json             # Vercel deployment configuration
├── css/
│   └── style.css           # Vedic design system, animations & responsive grid
├── js/
│   ├── translations.js     # English & Hindi bilingual dictionaries + 16 Sanskars data
│   └── main.js             # i18n switcher, interactive form, modal & accordion logic
└── assets/
    ├── icons/              # Custom Vedic SVG icons (om, kalash, diya, swastika, kundali-chart, norway-flag)
    └── images/             # Decorative SVG patterns (mandala.svg)
```

## How to Test Locally

You can serve the static site locally with any static web server:

```bash
# Using python built-in server:
python3 -m http.server 8080

# Or using npx serve:
npx serve .
```
Then open `http://localhost:8080` in your web browser.

## How to Deploy on Vercel

### Option 1: Vercel CLI
```bash
npx vercel
```

### Option 2: Git Integration
Push this repository to GitHub/GitLab/Bitbucket and import it directly into your [Vercel Dashboard](https://vercel.com). Vercel will automatically detect the static project and deploy it instantly.
