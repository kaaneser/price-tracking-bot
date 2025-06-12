# 📄 Project Design Document
This document will detail the general structure of the project and technologies used.

## 📏 General Project Information
**Project Name:** Online Shopping Price Tracking Bot
**Description:** This project allows users to track the prices of specific products. Users can monitor selected products based on specific criteria and receive notifications (via email, SMS, or Telegram) when there is a price change (e.g., when the price drops to a certain level).
### Core Features for Users:
- Track product prices by entering the URL of the website
- Search for products with filtering options such as product type, color, price, range, etc.
- Set up notifications for price tracking (email, SMS, Telegram)
- View price history for a specific product.

## ⛏️ Technologies
**Frontend:** Next.js (based on React), Tailwind CSS (for styling)
**Backend:** Node.js, Express.js (API server)
**Web Scraping:** Puppeteer
**Database:** MongoDB
**Notification Systems:**
- **Email:** SendGrid
- **SMS:** Twilio API
- **Telegram:** Telegram Bot API

**Scheduler:** Node-cron (for price checking)