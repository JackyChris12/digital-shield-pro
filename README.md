# Aegis Shield – Universal Digital Protection Platform

[![PowerHack 2024 Winner](https://img.shields.io/badge/PowerHack%202024-Winner-blue)](https://powerhack.com)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-aegiss.netlify.app-blue)](https://aegiss.netlify.app)
[![Pitch Deck](https://img.shields.io/badge/Pitch%20Deck-Canva-orange)](https://canva-link-provided)

AI-Powered Protection Against Digital Violence for Women & Girls

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Technical Implementation](#technical-implementation)
- [Installation](#installation)
- [Usage](#usage)
- [Team](#team)
- [Security & Privacy](#security--privacy)
- [Impact](#impact)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Aegis Shield is a universal digital protection platform designed to identify, classify, and respond to online threats targeting women and girls. The system monitors connected social media accounts, detects harmful interactions using AI, and triggers structured emergency response workflows to ensure user safety.

Developed in 24 hours for PowerHack 2024 under the theme: "UNiTE to End Digital Violence Against All Women & Girls." Aegis Shield emerged as the winning project, recognized for its innovation, impact, and technical execution.

## Problem Statement

Digital violence—including harassment, cyberbullying, hate speech, and direct threats—has become a major safety issue for women and girls. Existing digital safety tools are fragmented, platform-specific, and lack automated emergency response capabilities.

Aegis Shield addresses this by providing a single AI-driven protection layer across multiple social platforms with immediate safety action mechanisms.

## Key Features

### 1. Social Media Protection
- Connect and monitor multiple social accounts.
- Real-time AI scanning of comments and interactions.
- Detection of harassment, hate speech, threats, and harmful patterns.
- Severity-based threat classification: Low → Medium → High → Critical.
- Platform connection health and monitoring dashboard.

### 2. Intelligent Alert System
- Multi-level threat scoring powered by AI.
- Detailed alert logs with timestamps and platform context.
- Real-time notifications for high and critical threats.
- Exportable incident reports (CSV/PDF) for legal purposes.

### 3. Safe Circle Emergency Network
- Add trusted emergency contacts.
- Custom alert thresholds per contact.
- Automatic notifications on critical threats.
- One-tap emergency activation for immediate help.
- Multi-channel notifications (SMS, email, push).

### 4. Mobile-First Safety Interface
- Optimized for one-handed operation.
- Always-visible emergency action button.
- Offline support for key emergency functions.
- High contrast and accessible design for stressful situations.

## Technical Implementation

### Architecture Overview
```
Frontend (React + TypeScript + PWA)
         ↓
Backend API (Node.js + Express)
         ↓
Social Media APIs (Twitter, Instagram, TikTok)
         ↓
Supabase (PostgreSQL + Real-time Subscriptions)
         ↓
AI Engine (Google Perspective API + Custom NLP)
         ↓
Notification Services (Safe Circle Alerts)
```

### Technology Stack

#### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Supabase Authentication
- Progressive Web App (PWA)

#### Backend
- Node.js
- Express.js
- Webhook ingestion handlers
- Supabase PostgreSQL (real-time)

#### AI & Machine Learning
- Google Perspective API
- Custom NLP-based threat classification
- Multi-factor scoring model (context, frequency, severity)
- Pattern detection for threat escalation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JackyChris12/digital-shield-pro
   cd digital-shield-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in your Supabase credentials and API keys.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Sign Up/Login**: Create an account or log in using Supabase authentication.
2. **Connect Platforms**: Link your social media accounts (Twitter, Instagram, TikTok) in the Settings page.
3. **Configure Safe Circle**: Add trusted contacts and set alert thresholds.
4. **Monitor Alerts**: View real-time alerts on the Dashboard and respond to threats.
5. **Emergency Activation**: Use the emergency button for immediate help in critical situations.

## Team

Aegis Shield was built by a focused, multidisciplinary team committed to solving a real-world digital safety problem.

- **Brian** – Lead Developer & System Architect  
  Designed overall system architecture and data flow. Developed the frontend using React + TypeScript with PWA capabilities. Implemented Supabase authentication and real-time database structures. Built backend services, AI threat analysis pipelines, and notification workflows. Integrated social media monitoring endpoints and deployed the full MVP.

- **Jackline** – UI/UX Lead & Accessibility Specialist  
  Designed the mobile-first user interface optimized for emergency scenarios. Created user flows for Safe Circle, alert screens, and emergency activation. Ensured accessibility compliance (contrast, readability, stress-friendly UI). Developed visual identity and interactive layouts used throughout the platform.

- **Silvia** – Research & Safety Insights Lead  
  Conducted deep research on patterns of digital violence affecting women and girls. Defined the problem framework, threat categories, and safety needs. Created user personas, safety protocols, and requirement specifications. Informed the threat classification system and Safe Circle logic through analysis.

## Security & Privacy

- Full user consent for all integrations.
- Encrypted storage for incident records.
- Strict data minimization (no unnecessary data retention).
- GDPR-aligned data handling approach.

## Impact

Aegis Shield enhances digital safety by offering:

- Universal monitoring across social platforms
- AI-driven threat detection
- Immediate emergency escalation
- Evidence-backed safety reporting

The platform empowers women and girls to navigate online spaces with improved security and confidence.

## Contributing

We welcome contributions to improve Aegis Shield. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

The team remains open to partnerships, integrations, and further development opportunities to scale the solution and reach more communities.

For inquiries, please contact us at [team@aegisshield.com](mailto:team@aegisshield.com).
