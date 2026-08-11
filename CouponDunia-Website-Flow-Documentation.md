# CouponDunia (coupondunia.in) — Complete Website Flow & Replication Blueprint

**Document purpose:** Public-site UX/architecture reference for building a **similar** coupons + cashback + affiliate platform (not a pixel-perfect clone).  
**Source reviewed:** https://www.coupondunia.in/ (July 2026)  
**Language:** Hindi + English (Hinglish) for easy implementation planning.

---

## 1. Platform overview (kya hai ye site?)

CouponDunia ek **affiliate + cashback aggregator** hai jo:

- **Coupons** (promo codes) — instant checkout discount  
- **Deals** — bina code ke landing-page offers  
- **CD Cashback** — order ke baad wallet me cashback  
- **Bank / Wallet offers** — payment method discounts  
- **Browser extension + mobile app** — tracking & reminders  

**Revenue model (aapko bhi ye chahiye):** Merchant affiliate commission → user ko cashback share → margin platform par.

**User journey (3 steps — homepage par dikhaya gaya):**

1. Log in & shop (offer activate karke merchant par jao)  
2. Cashback wallet me add ho  
3. Bank / Paytm / vouchers me withdraw  

---

## 2. Global layout (har page par common)

### 2.1 Header (top bar)

| Element | Behavior |
|--------|----------|
| Logo | Home link |
| **Search** | Stores, products, categories search (placeholder examples: iPhone, Grocery, Samsung M51) |
| **Categories** | Mega menu — category groups + featured offers |
| **Top Stores** | Popular merchants + offer count |
| **Best Offers** | Trending deals across site |
| **Collections** | Curated offer groups (Festival, Bank, Wallet, Seasonal, etc.) |
| **Share & Earn** | Referral / share link program (NEW badge) |
| **Add to Chrome** | Shopping Assistant browser extension CTA |
| User area | Login/Signup, wallet balance (₹0), notifications, “You” profile |

### 2.2 Footer

- **Help & Support:** FAQs, How It Works, Missing Cashback Claims, Contact Us  
- **Company:** About, Press, Media, List Your Business, Privacy, T&C  
- **Programs:** Shopping Assistant, Share & Earn, Refer & Earn, Download App  
- **SEO link blocks:** Fashion, Beauty, Mobiles, Travel, Food, Laptops, Sales pages  
- **Blog + Jobs + Email subscribe**  
- Social: Facebook, Instagram, Twitter, Telegram  
- Copyright (Bennett Coleman / Indiatimes Commerce Network)

### 2.3 Auth modals (login/signup flow)

- Google OAuth (Facebook discontinued message)  
- Email + password (min 6 alphanumeric)  
- Signup: name, email, password, **+91 mobile**, referral code optional  
- **OTP verification** (SMS, resend timer)  
- T&C + Privacy consent checkboxes  
- Post-login: “You're about to earn Cashback” + redirect to shopping  

### 2.4 Global modals / interceptors (offer click par)

Ye sab replicate karte waqt **miss mat karna** — conversion + tracking ke liye critical:

| Modal | Trigger |
|-------|---------|
| Login / Signup gate | Exclusive offers, extra cashback |
| **Coupon + Cashback vs Coupon Only** | User choice before reveal |
| **Deal + Cashback vs Deal Only** | Same for deals |
| Show Coupon / COPY CODE | Code reveal + affiliate redirect |
| Deal Activated (no code) | Direct merchant redirect |
| Adblock warning | Tracking block — cashback loss warning |
| Offer worked? Yes/No | Feedback + quality signal |
| Email verify for some codes | Verified users only |
| Phone OTP for limited codes | Anti-abuse |
| Shopping Assistant upsell | Extension install |
| App-only offer | SMS link to phone |
| Push notification permission | Cashback/deal updates |

---

## 3. Homepage flow (`/`)

### 3.1 Hero / trust

- H1: *Welcome to CouponDunia - India's Trusted Coupons, Offers & Cashback Website*  
- **3-step cashback explainer** (Login → Earn → Withdraw)  
- Optional login nudge: “Extra Savings”  

### 3.2 Section: Choose Your Favourite Stores

- Fixed favourite slots: **Flipkart, Amazon, Myntra, AJIO**  
- Each card: **Add / Added** (user favourites — personalization)  
- CTA: **Find More → View all stores & cashback** (`/stores`)

### 3.3 Section: Top Online Shopping Cashback Stores

- Horizontal store logos (Amazon, Flipkart, Myntra, AJIO, etc.)  
- Per store: **“XX offers”** count  
- **View All** link  

### 3.4 Section: Top Categories

Category chips (homepage):

- Fashion  
- Beauty & Health  
- Mobiles & Tablets  
- Appliances  
- Travel  
- Computers, Laptops & Gaming  
- **Offers** (mixed)  
- **Show More**  

Har category ke andar **featured offer cards** (store + headline + Get Deal / Show Coupon).

### 3.5 Section: Stores (summary grid)

Store tiles with breakdown, e.g.:

- Flipkart — 13 offers — **13 Deals**  
- Amazon — 29 offers — **1 Coupon, 28 Deals**  
- Myntra — 54 offers — **12 Coupons, 42 Deals**  
- AJIO — 91 offers — **14 Coupons, 77 Deals**  

### 3.6 Section: High Cashback Stores

- Examples: Dailyobjects, Agoda, Bewakoof, Marks & Spencer  
- Signup CTA block for cashback  

### 3.7 Section: Top Online Shopping Offers

- Tabs/filters: **Today's Best Offers**, **CD Exclusive**  
- Offer carousel cards  

### 3.8 Section: Looking For More Offers

- **Bank Offers** (SBI, ICICI, CITI, AXIS, HSBC, KOTAK, …)  
- **Wallet Offers** (Paytm, Mobikwik, PayPal, Tez/GPay, Payzapp, FreeCharge, …)  

### 3.9 SEO / marketing blocks

- “Why CouponDunia” + comparison table vs other coupon/cashback sites  
- Customer testimonials  
- FAQ accordion  
- About stats: 3000+ brands, Times Group, etc.

---

## 4. Header mega menus (detail)

### 4.1 Categories menu

**Featured groups (examples):**

- Mobile & Tablets → Mobile, Tablet, Accessories  
- Fashion → Clothing, Footwear, Bags  
- Food → Pizza, Food Delivery, Grocery  
- Travel → Bus, Flight, Train, Cabs, Hotel  
- Other → Recharge, Movie Tickets, Nutrition  

**Other categories list:**

TV/Audio/Movies, Beauty & Health, Miscellaneous, Computers/Laptops/Gaming, Appliances, Home Furnishing, Gifts/Jewellery, Books, Kids/Babies/Toys, Cameras, Sports & Fitness  

Link: **View all Categories**

### 4.2 Top Stores menu

Featured with offer counts, e.g. Amazon (111), Flipkart (56), AJIO (96), Myntra (70), …  
**View All Stores**

### 4.3 Best Offers menu

Category-wise trending offers + “See More {Category} Offers” links to `/category/{slug}`

### 4.4 Collections menu

| Group | Examples |
|-------|----------|
| Mega Sale | Amazon Super Value Days, Myntra EORS, Flipkart Big Saving Days, Prime Day |
| Festival | Wedding, Rakhi, New Year, Eid |
| Bank | HSBC, ICICI, DBS, Axis, Standard Chartered |
| Wallet | Paytm, Mobikwik, PhonePe, Google Pay |
| Promotional | Amazon/Flipkart/Myntra/AJIO/Domino's offers |
| Seasonal | Monsoon, Winter, Summer |
| Special | Father's Day, AC, Refrigerator, Exclusive coupons |

---

## 5. All Stores page (`/stores`)

**Title:** All Stores Coupons & Offers

### 5.1 Left sidebar

- **Categories** (multi-select checklist) — same taxonomy as site-wide  
- **Clear** filters  
- **Refer & Earn** promo widget  

### 5.2 Main content

- Toggle: **All** | **Cashback Only**  
- **A–Z index:** ALL, #, A, B, C, … Z  
- Alphabetical **store directory** (thousands of merchants)  
- Each store links to merchant page: `/{store-slug}` (NOT always `-coupons` suffix)

### 5.3 URL pattern note

- Correct: `/amazon`, `/flipkart`, `/shopclues`  
- Wrong / 404: `/amazon-coupons` (legacy or SEO redirect may vary)

---

## 6. Category page (`/category/{slug}`)

**Example:** `/category/fashion`

### 6.1 Page header

- H1: *Fashion Coupons & Offers (date)*  
- Short SEO description  
- **Top Stores in Fashion** — quick links with offer counts  

### 6.2 Offer listing (center — category pages often **full width**, store-style left filters optional)

**Tabs (counts dynamic):**

- **All (3397)**  
- **Coupons (543)**  
- **Cashback (0)**  
- **Deals (2854)**  

### 6.3 Offer card structure (category + store pages same pattern)

| Field | Description |
|-------|-------------|
| Store logo/name | e.g. Amazfit, Molife |
| Badge | Exclusive, % OFF, etc. |
| **X People Used Today** | Social proof |
| Title | Offer headline |
| Subtitle / truncated text | See more |
| CTA | **Get Coupon** OR **Get Deal** |
| Coupon code preview | e.g. `AMAZFIT250` (hidden until click) |
| **Show Details / Hide Details** | Expand T&C bullets |
| Cashback line | e.g. `5.2% Cashback` or `Rs. Cashback` |
| **Success rate** | e.g. `97% Success` |
| **Load More** | Pagination |

### 6.4 Bottom content

- SEO table: latest coupons summary  
- Long-form category article  
- FAQ  

---

## 7. Store / Merchant page (`/{merchant-slug}`) — **sabse important flow**

**Example:** `/amazon`  
**Title pattern:** `{Store} Coupons: {max discount} + {cashback}% Cashback {Month Year}`

### 7.1 Breadcrumb

`Home → Stores → {Store} Coupons`

### 7.2 Store header (top of main column)

- H1: e.g. *Amazon Promo Codes Today (21st Jul 2026)*  
- Verified description (expand See more / See less)  
- **Store rating:** e.g. 4.8, 3410 ratings, **Rate** action  
- Primary CTA: **Shop at {Merchant}** (affiliate out-click)  
- Quick stats box (sidebar/mobile): Today's best offer, total offers, uses today  

### 7.3 Three-column layout (desktop)

```
┌─────────────────┬──────────────────────────────┬─────────────────┐
│  LEFT (~25%)    │  CENTER (~50%)               │  RIGHT (~25%)   │
│  Filters        │  Offer tabs + offer cards    │  Widgets        │
└─────────────────┴──────────────────────────────┴─────────────────┘
```

---

## 8. LEFT SIDEBAR — Store page filters (exact groups)

**Heading:** Filters + **Clear**

### 8.1 User Type

- New {Store} User  
- Existing {Store} User  

*(Checkbox filters — offer list client/server filter)*

### 8.2 Bank & Wallet Offers

Checkbox list with **counts in parentheses**, e.g.:

- Amazon pay (8)  
- ICICI Bank (1)  
- Axis Bank (1)  
- Bank offers (1)  
- HDFC Bank (4)  

*(Merchant-specific; class names on site: `bank-chk-filter`, `bank-filter`)*

### 8.3 Categories (nested)

**Parent category** (count) → expand **sub-categories** (count)

Amazon example parents:

| Parent | Sub-examples |
|--------|----------------|
| Mobiles & Tablets | mobile-and-tablet-accessories, mobile, tablet |
| Computers, Laptops & Gaming | laptops-monitors-desktops, computer-accessories, gaming, software |
| Fashion | clothing, bag-and-accessory, watches, footwear, lingerie |
| Beauty & Health | personal-care, makeup, perfumes, nutrition, medicines |
| Appliances | home/kitchen/personal-care appliances, cleaning |
| TV, Audio/Video & Movies | televisions, audio, movies, on-demand content |
| Home Furnishing & Decor | kitchen-dining, furniture, bed-bath, tools |
| Cameras & Accessories | cameras, camera-accessories |
| Food & Dining | grocery, drinks, food-ordering, restaurants, pizza |
| Kids, Babies & Toys | baby-products, apparel, toys, school-essentials |
| Sports & Fitness | fitness equipment, sports apparel, supplements |
| Gifts & Jewellery | gifts, chocolates, jewellery, soft toys, gold coins |
| + Books, Entertainment, Automotive, Travel, Recharge, Local Services, Miscellaneous |

*(Classes: `category-chk-filter`, `cat-filter`, `sub-cat-filter-{parent}`)*

### 8.4 Useful Tips (store-specific)

Bullet T&C reminders (delivery, cart rules, net amount tracking, etc.)

### 8.5 Loved {Store}? Explore These Brands Next

Cross-sell links: Flipkart, Tata CliQ, AJIO, JioMart, Paytm Mall, ShopClues, …

---

## 9. CENTER — Store page offer list

### 9.1 Tabs

- **All (109)**  
- **Coupons (16)**  
- **Cashback (0)**  
- **Deals (93)**  

### 9.2 Offer card (same as category page)

Additional states:

- **Activated** — pre-applied coupon flow  
- **Get Coupon** / **Get Deal**  
- Usage count, success %, cashback %  

### 9.3 Pagination

**Load More** button (infinite/load batch)

### 9.4 Below offers — SEO content blocks (Amazon example)

Long sections (H2/H3):

- Latest {Store} Coupons table (month/year)  
- About store / shopping guide  
- Best selling categories  
- Bank & wallet offers today  
- Sale calendars (Prime Day, Great Indian Festival, etc.)  
- How to use coupons on {store}  
- **Large FAQ** (40+ questions on Amazon page)  

---

## 10. RIGHT SIDEBAR — Store page widgets

*(Amazon page: widgets appear in page flow; “Today's Amazon Best Offers” summary block)*

Typical right column content:

| Widget | Content |
|--------|---------|
| **Today's Best Offers** | Top 2–3 headline offers |
| Summary table | Total Offers, Best Offer, Uses Today |
| **Top Stores** | Amazon, Flipkart, Myntra, MakeMyTrip, Ajio, … |
| **Top Categories** | Travel, Food, Fashion, Beauty, Mobiles, … |
| **Top Collections** | Festival, Bank, Wallet, Special, Promotional, Seasonal |
| **Cashback Rates** (modal/section) | Category-wise cashback table + search |
| **Terms & Conditions** | Tracking rules, adblock, cancellation, app exclusions |
| **Estimated Payment Date** | e.g. 15 Oct 2026 |
| **Tracking Speed** | e.g. 2 days |
| **Missing Cashback** | Accepted / Not Accepted |
| Extension CTAs | Shopping Assistant, Share & Earn, Refer & Earn |

**ShopClues page example (right/bottom):**

- “What are you shopping for?” intent capture  
- Cashback rate table by product category search  

---

## 11. Offer activation flow (technical)

### 11.1 User clicks Get Coupon / Get Deal

1. Optional **login gate** (exclusive offers)  
2. Modal: **Option 1: Coupon/Deal + Cashback** vs **Option 2: Only** (guest allowed on option 2)  
3. Adblock check  
4. Affiliate redirect URL with tracking params (site uses `?h=` hash on many out-links)  
5. New tab / same tab to merchant  
6. Post-return: “Did this work?” feedback  

### 11.2 Coupon types

| Type | UI |
|------|-----|
| Code required | COPY CODE + visit merchant checkout |
| No code | Deal Activated → Go To Website |
| Collect on landing page | “Collect coupon from landing page” in details |
| CD Exclusive | Login / verified email / OTP |

### 11.3 Cashback tracking rules (displayed to user)

- Don't visit other coupon sites after click-out  
- Disable adblock  
- No cashback on cancelled/returned orders  
- Raise missing cashback ticket after 7 days  
- Many merchants: **no app cashback** unless stated (Amazon/Flipkart/AJIO exception noted)  

---

## 12. Other important pages

| Page | URL pattern | Purpose |
|------|-------------|---------|
| Share & Earn | `/share-offers-earn-money` | Share offer links, earn when others shop |
| How It Works | footer link | Education |
| Missing Cashback | footer link | Ticket/claim flow |
| In-store offers | `/in-store-coupons-offers` | Offline merchant coupons |
| Bank/Wallet collection | under Collections | Aggregated payment offers |
| Blog | footer | SEO content |
| List Your Business | footer | B2B merchant onboarding |

---

## 13. Data model (database design for replication)

### 13.1 Core entities

```
Merchant (Store)
  - slug, name, logo, description, website_url
  - default_cashback_rate, tracking_speed_days
  - rating_avg, rating_count
  - seo_title, seo_description

Category
  - slug, name, parent_id (tree)

Offer
  - merchant_id, type: coupon | deal | cashback
  - title, subtitle, terms_html, coupon_code (nullable)
  - discount_label (e.g. "UPTO 80% OFF")
  - is_exclusive, is_cd_exclusive
  - user_type: new | existing | all
  - bank_tags[], category_tags[]
  - affiliate_url, tracking_param
  - success_rate, used_today_count
  - start_at, end_at, is_active

OfferCategory (many-to-many)
OfferBankFilter (many-to-many)

User
  - auth (Google, email), mobile_verified, email_verified
  - wallet_balance, referral_code

UserFavouriteMerchant
CashbackTransaction
  - user_id, offer_id, order_amount, cashback_amount, status, expected_payout_date

StoreRating
OfferFeedback (worked: yes/no)
```

### 13.2 Homepage CMS blocks

- `favourite_stores` (ordered)  
- `top_cashback_stores`  
- `top_categories` + nested featured offers  
- `high_cashback_stores`  
- `bank_offers`, `wallet_offers`  
- `comparison_table`, `testimonials`, `faq`  

### 13.3 Filter API (store page)

`GET /api/merchants/{slug}/offers?type=all|coupons|deals|cashback&banks[]=hdfc&categories[]=fashion&user_type=new&page=1`

---

## 14. Frontend components checklist (koi cheez miss na ho)

- [ ] Global header + 4 mega menus  
- [ ] Search autocomplete (stores + products)  
- [ ] Auth modals + OTP + referral code  
- [ ] Homepage 9+ sections (Section 3)  
- [ ] Store directory A–Z  
- [ ] Category landing + top stores row  
- [ ] Merchant page 3-column layout  
- [ ] Left filter panel (user type, bank, nested categories)  
- [ ] Offer tabs with live counts  
- [ ] Offer card + expand details  
- [ ] Coupon reveal modal + copy button  
- [ ] Cashback vs guest choice modal  
- [ ] Adblock detector  
- [ ] Feedback modal  
- [ ] Wallet header widget  
- [ ] Extension / app CTAs  
- [ ] Footer SEO columns  
- [ ] Push notification prompt  
- [ ] SEO long content + FAQ schema  
- [ ] Mobile responsive (filters → drawer)  

---

## 15. Admin / ops (backend you will need)

- Offer CRUD + bulk import from affiliate networks  
- Coupon verification / expiry cron  
- Cashback reconciliation with affiliate reports  
- Missing cashback ticket workflow  
- A/B on offer ranking (“People Used Today”)  
- Fraud: OTP limits, adblock messaging, click-out cookie window  

---

## 16. Suggested build phases

**Phase 1 — MVP:** Home, `/stores`, `/category/{slug}`, `/merchant`, offer click → affiliate redirect, basic auth  
**Phase 2:** Cashback wallet, tracking pixels/postbacks, filters with counts  
**Phase 3:** Extension, Share & Earn, bank/wallet collections, ratings & feedback  
**Phase 4:** SEO content engine, app, personalization (favourite stores)  

---

## 17. Legal note

CouponDunia ka brand, copy, logos, aur exact UI **copy mat karo**. Is document ka use **apne brand** ke saath similar **functionality** banane ke liye karo; affiliate terms har merchant ke saath comply karo.

---

**File location:** `C:\Users\HP\Documents\CouponDunia-Website-Flow-Documentation.md`  
**Tip:** Is file ko Microsoft Word me kholne ke liye: Word → Open → ye `.md` file select karo, ya “Save As” → `.docx`.
