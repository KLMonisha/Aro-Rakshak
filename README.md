# AroRakshak 🛡️

AI-assisted disease screening for India's 1M+ ASHA workers — built for rural, low-connectivity field conditions where specialist access doesn't exist.

The first module, **LeproSight**, guides health workers through leprosy screening using a step-by-step clinical questionnaire and CNN-based skin patch image analysis — generating instant risk assessments and referral reports.

> ⚠️ AroRakshak is a screening tool, not a diagnostic system. Final diagnosis is always made by a qualified medical professional.

---

## The Problem

75% of India's health infrastructure is concentrated in urban areas, while India carries 42% of the global tropical disease burden — mostly in rural villages. ASHA workers visit patients daily with no diagnostic tools, making critical decisions on intuition alone. Delayed detection leads to preventable deaths from conditions that are fully treatable when caught early.

---

## Features

- 📊 **Health worker dashboard** — patients registered, screenings today, high-risk cases
- 👤 **Patient registration** — name, age, gender, village, contact
- 🔍 **Patient search** — search by name or village
- 📋 **Guided screening questionnaire** — structured symptom input in under 5 minutes
- 🤖 **AI image analysis** — CNN-based classification of skin patches *(in development)*
- 📄 **Referral report generation** — instant actionable output *(in development)*
- ⚡ **Offline-first** — designed for low/no connectivity environments *(planned)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| AI/ML | CNN-based image classification, Python, TensorFlow |
| Backend | FastAPI *(planned)* |
| Database | PostgreSQL *(planned)* |

---

## Current Status

Frontend is complete — dashboard, patient registration, patient list, and search are fully functional. CNN model training and backend integration are next.

---

## Roadmap

- [x] Landing page + feature overview
- [x] Health worker dashboard
- [x] Patient registration and search
- [ ] Guided clinical questionnaire
- [ ] CNN model training on leprosy skin patch dataset
- [ ] Image upload + AI classification
- [ ] Risk score + referral report generation
- [ ] Offline-first data persistence
- [ ] Dengue and Malaria modules (Phase 2)

---

## Author

Built by [K L Monisha](https://github.com/KLMonisha)
