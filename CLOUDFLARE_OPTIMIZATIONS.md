# ⚡️ Cloudflare Optimization Documentation
**Domain:** `weluxevents.com`
**Plan:** Free
**Status:** Fully Optimized (MAX Capabilities)

This document details the configuration applied to optimize Security, Performance, and Reliability.

## 🔒 1. SECURITY (The Firewall)

### ✅ Bot Fight Mode
- **Status:** `Active`
- **Function:** Blocks known malicious bots.
- **Benefit:** Protects `DEEPSEEK_API_KEY` credits from scrapers and credential stuffing attacks.

### ✅ Strict SSL/TLS
- **Status:** `Active`
- **Function:** Enforces HTTPS for all connections.
- **Benefit:** End-to-end encryption and trust.

### ✅ WAF (Web Application Firewall)
- **Status:** `Active`
- **Rules:** Basic protection against common vulnerabilities.

---

## ⚡ 2. PERFORMANCE (Speed)

### ✅ Smart Tiered Cache
- **Status:** `Active` (Topology: Smart)
- **Function:** Uses Cloudflare’s global network to serve content from the nearest cache server to the user, reducing requests to the origin.
- **Benefit:** Significantly faster load times for international users (e.g., LatAm, Asia).

### ✅ Edge Cache Rules (Custom)
- **Rule Name:** `Cache Imagenes Estaticas`
- **Target:** `*.png`, `*.jpg`, `*.jpeg`, `*.webp`
- **Configuration:**
    - **Edge Cache TTL:** 1 Month (30 Days)
    - **Browser TTL:** 30 Days
    - **Cache Level:** Cache Everything
- **Benefit:** Heavy assets (like logos and hero images) are stored at the Edge, loading instantly after the first visit.

### ✅ Protocol Optimizations
- **HTTP/3 (QUIC):** `Active` (Fastest protocol).
- **TLS 1.3:** `Active` (Fastest and most secure encryption).
- **0-RTT Resume:** `Active` (Instant reconnection).
- **Early Hints:** `Active` (Pre-loads resources).

---

## 📊 3. ANALYTICS & MONITORING

### ✅ Web Analytics (RUM)
- **Status:** `Active`
- **benefit:** Privacy-friendly real-time monitoring of Core Web Vitals (LCP, CLS, FID).

---

## 🛠 MAINTENANCE

### Purging Cache
To update cached assets (like logos) immediately:
```bash
npm run purge
# Or directly:
./scripts/purge-cache.sh
```
*Requires `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` in `.env`.*
