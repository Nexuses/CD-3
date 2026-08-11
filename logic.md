# Coupon Sharing Website — Phase 1 MVP Blueprint (Admin Controlled)

**Document purpose:** Build a fully functional coupon/deal aggregator where an **Admin** manages all content (Stores, Categories, Offers), and **Visitors (Users)** browse, search, and copy/use coupons without needing to register or log in.  
**Scope:** Public UI + Admin Panel. (Cashback, Wallets, Referrals, and User Profiles are postponed to Phase 2).

---

## 1. Platform Overview (Kya hai ye site?)

A simple, fast, and SEO-friendly **coupon & deal directory**.

- **Visitors** can browse stores, categories, and view active promo codes / deals.
- **Visitors** click "Get Coupon" to reveal the code or "Get Deal" to redirect to the merchant.
- **Admin** logs into a secure backend to add, update, or remove stores, categories, and offers.
- **Revenue Model (Initial):** Affiliate commissions via outbound clicks (merchant links).

---

## 2. Global Layout — Public Website (Har page par common)

### 2.1 Header (Top Bar)
| Element | Behavior |
| :--- | :--- |
| **Logo** | Links to Homepage (`/`) |
| **Search Bar** | Global search for Stores, Categories, or Offer titles (placeholder: "Search for Amazon, Flipkart, Grocery..."). |
| **Categories** | Mega menu / dropdown listing all parent categories. |
| **Top Stores** | Dropdown with popular merchants (Amazon, Flipkart, Myntra). |
| **Admin Login** | A subtle link/button in the top-right corner (`/admin/login`). |
| **Visitor area** | No user avatar/wallet. Just a simple "Login" link for the admin only. |

### 2.2 Footer
- **Help & Support:** How It Works, Contact Us, FAQ.
- **Company:** About Us, Privacy Policy, Terms & Conditions.
- **Programs:** (Stripped: Share & Earn removed. Keep "Download App" placeholder if needed later).
- **SEO Link Blocks:** Fashion, Beauty, Mobiles, Travel, Laptops, etc.
- **Social Links:** Facebook, Instagram, Twitter, Telegram (optional).
- **Copyright:** © 2026 YourBrand.

### 2.3 Admin Login (Standalone Page)
- Route: `/admin/login`
- UI: Clean centered card with **Username** and **Password** fields.
- Security: Session-based (PHP/Laravel) or JWT-based (Node/React). Rate limiting to prevent brute force.
- On success: Redirect to Admin Dashboard (`/admin/dashboard`).
- On failure: Show "Invalid credentials" error.

---

## 3. Homepage Flow (Public — `/`)

### 3.1 Hero / Trust
- H1: *"Find the Best Coupons & Deals for Your Favorite Stores"*
- Short tagline: *"Save money on every purchase. Verified codes updated daily."*

### 3.2 Section: Top Stores
- Horizontal scrollable store logos (Amazon, Flipkart, Myntra, AJIO, etc.).
- Each card shows the store name and **"XX Offers"** count.
- CTA: **View All Stores** → links to `/stores`.

### 3.3 Section: Top Categories
- Category chips: Fashion, Mobiles & Tablets, Appliances, Travel, Food, Beauty, etc.
- Clicking a chip takes you to `/category/{slug}`.
- Beneath categories: Display a grid of **featured offers** from those categories (store name + offer headline + "Get Deal" button).

### 3.4 Section: Today's Best Offers
- Carousel or grid of popular offers.
- Displays: Store logo, Offer Title, Discount Badge (e.g., "UPTO 70% OFF"), and "Get Coupon" CTA.

### 3.5 Section: Bank & Wallet Offers (Static Aggregation)
- Show buttons/tags: SBI, ICICI, HDFC, AXIS, Paytm, Google Pay.
- Clicking a bank tag filters offers that have that tag (or redirects to a collection page).

### 3.6 SEO / Marketing Blocks
- "Why Choose Us?" bullet points.
- FAQ accordion (e.g., "How do I use a coupon?").
- Statistics: "3000+ Brands", "Daily Updated Offers".

---

## 4. All Stores Page (`/stores`)

**Title:** All Stores Coupons & Offers

### 4.1 Left Sidebar (Filters)
- **Categories** (Checkbox list).
- **Clear Filters** button.
- (Stripped: User Type, Cashback toggle removed).

### 4.2 Main Content
- **A–Z Index:** ALL, #, A, B, C, … Z.
- Alphabetical **store directory**.
- Each store tile links to `/{store-slug}`.
- **Search within stores** input box.

---

## 5. Category Page (`/category/{slug}`)

**Example:** `/category/fashion`

### 5.1 Page Header
- H1: *"Fashion Coupons & Offers"*.
- Short SEO description.

### 5.2 Offer Listing (Full Width / Grid)
- **Tabs** (with dynamic counts):
  - All (X)
  - Coupons (X)
  - Deals (X)
- **Offer Card Structure:**
  - Store Logo + Name.
  - Badge (e.g., "Exclusive", "Verified").
  - Title & truncated description.
  - `**X People Used Today**` (click counter).
  - CTA: **Get Coupon** (for code) or **Get Deal** (for redirect).
  - Coupon code preview (hidden until click: e.g., `******`).
  - Expandable Terms & Conditions.
- **Load More** (Pagination).

### 5.3 Bottom SEO Content
- Long-form article about the category.
- Related FAQ.

---

## 6. Store / Merchant Page (`/{merchant-slug}`) — **Most Important Page**

**Example:** `/amazon`

### 6.1 Page Header
- H1: *"Amazon Coupons & Offers"*.
- Store description (expandable).
- Store rating (optional, admin can set a static rating or disable).

### 6.2 Left Sidebar (Filters)
- **Category Filters** (Nested checkboxes specific to this store, e.g., Mobiles, Fashion, Appliances).
- **Bank/Wallet Tags** (Checkboxes, e.g., HDFC, ICICI, Paytm).

### 6.3 Center — Offer List
- **Tabs:** All (X) \| Coupons (X) \| Deals (X).
- **Offer Cards** (same as Category page).
- **Load More** button.

### 6.4 Right Sidebar
- **Today's Best Offer** (Highlight top 1-2).
- Summary Box: Total Offers, Best Discount.
- **Top Stores** (Cross-sell links to other stores).
- **Top Categories** (Quick links).

---

## 7. Offer Activation Flow (Public)

1. Visitor clicks **"Get Coupon"** or **"Get Deal"**.
2. Modal pops up:
   - **Coupon:** Shows the actual coupon code (e.g., `AMAZFIT250`) with a **"Copy Code"** button + **"Visit Store"** button (affiliate link).
   - **Deal:** Shows a **"Go To Website"** button (affiliate link).
3. Clicking "Visit Store" or "Go To Website" opens the merchant's website in a new tab with the affiliate tracking link (`?ref=yourid`).
4. **(No Login Gate)** — Everyone can see the codes instantly. Admin can toggle "Exclusive" mode to hide codes behind a simple "Click to Reveal" (still no login).
5. Click counter (`used_today_count`) increments automatically on each click.

---

## 8. Admin Panel (Backend)

This is the **new core** of Phase 1. Accessible only via `/admin`.

### 8.1 Dashboard (`/admin/dashboard`)
- **Stats Cards:**
  - Total Stores
  - Total Active Offers
  - Total Categories
  - Total Clicks (All Time) / Clicks Today.
- Recent Activity Log (e.g., "Admin added Offer X", "Admin updated Store Y").

### 8.2 Manage Stores (`/admin/stores`)
- **Table View:** ID, Logo, Name, Slug, Website URL, Total Offers, Status (Active/Inactive), Actions.
- **Actions:** Edit | Delete | View Offers.
- **Add/Edit Store Form:**
  - Name (required)
  - Slug (auto-generated from Name, editable)
  - Logo URL (Image upload or URL)
  - Website URL (Affiliate/Homepage link)
  - Description (Textarea)
  - SEO Title / SEO Description (Meta tags)
  - Is Active (Toggle)

### 8.3 Manage Categories (`/admin/categories`)
- **Nested Tree View** (or flat list with Parent dropdown).
- **Add/Edit Form:**
  - Name
  - Slug
  - Parent Category (Dropdown) — to create nested structures (e.g., Mobiles > Accessories).

### 8.4 Manage Offers (`/admin/offers`) — **Most Crucial**
- **Table View:** ID, Store, Title, Type (Coupon/Deal), Discount, Expiry Date, Clicks, Status (Active/Expired), Actions.
- **Filters on Table:** Filter by Store, Type, Status.
- **Add/Edit Offer Form:**
  - **Store** (Dropdown linking to `merchants` table).
  - **Type** (Radio: Coupon | Deal).
  - **Offer Title** (e.g., "Get 20% off on Electronics").
  - **Subtitle / Short Description**.
  - **Coupon Code** (Text field. Show only if Type = Coupon).
  - **Affiliate / Redirect URL** (Required. The outbound link).
  - **Discount Label** (e.g., "UPTO 80% OFF", "FLAT ₹500 OFF").
  - **Terms & Conditions** (Textarea / Rich Editor).
  - **Category Tags** (Multi-select dropdown) — links offer to specific categories for filtering.
  - **Bank/Wallet Tags** (Multi-select dropdown) — e.g., HDFC, Paytm.
  - **Expiry Date** (Date picker. If empty, treat as "Never Expires").
  - **Is Active** (Toggle).
  - **Is Exclusive** (Toggle — if true, shows a "Click to Reveal" animation instead of straight text).
- **Bulk Import:** (Nice-to-have) Upload CSV with columns: Store, Title, Code, URL, Expiry, etc.

### 8.5 Admin Profile / Settings
- Change Admin Password.
- Site Settings (optional: Site Name, Meta Description, Footer Text).

---

## 9. Updated Data Model (Database Schema for Phase 1)

### 9.1 `admins` Table
| Variable | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Auto-increment |
| `username` | String (Unique) | Login username |
| `password_hash` | String | Bcrypt hash |
| `email` | String | Admin contact email |
| `created_at` | Timestamp | - |

### 9.2 `merchants` (Stores)
| Variable | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | - |
| `slug` | String (Unique) | e.g., `amazon` |
| `name` | String | e.g., "Amazon" |
| `logo` | String (URL) | Image path |
| `website_url` | String (URL) | Merchant homepage |
| `description` | Text | SEO/Public description |
| `seo_title` | String | Meta title |
| `seo_description` | Text | Meta description |
| `is_active` | Boolean | Toggle visibility |
| `created_at` | Timestamp | - |

### 9.3 `categories`
| Variable | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | - |
| `slug` | String (Unique) | e.g., `fashion` |
| `name` | String | e.g., "Fashion" |
| `parent_id` | Integer (FK) | Self-referencing (nullable) |

### 9.4 `offers`
| Variable | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | - |
| `merchant_id` | Integer (FK) | Links to `merchants` |
| `type` | Enum | `coupon` or `deal` |
| `title` | String | Headline |
| `subtitle` | String | Short description |
| `terms` | Text | Full T&C (expanded view) |
| `coupon_code` | String (Nullable) | Show if type = coupon |
| `affiliate_url` | String (URL) | Redirect link |
| `discount_label` | String | Badge text |
| `is_exclusive` | Boolean | Toggles click-to-reveal |
| `start_date` | Date | (Optional) |
| `expiry_date` | Date | (Optional) |
| `is_active` | Boolean | Soft delete / disable |
| `click_count` | Integer | Total clicks (for "X Used Today") |
| `created_at` | Timestamp | - |
| `updated_at` | Timestamp | - |

### 9.5 `offer_category` (Many-to-Many)
| Variable | Type |
| :--- | :--- |
| `offer_id` | Integer (FK) |
| `category_id` | Integer (FK) |

### 9.6 `offer_bank_tag` (Many-to-Many - Optional)
| Variable | Type |
| :--- | :--- |
| `offer_id` | Integer (FK) |
| `tag_name` | String (e.g., "HDFC", "Paytm") |

*(Note: `click_count` can be incremented via a simple server-side counter on redirect. No user table means no favorites, feedback, or transactions.)*

---

## 10. Updated Frontend Component Checklist (Phase 1)

- [ ] Public Header (Logo, Search, Categories dropdown, Stores dropdown, Admin Login link).
- [ ] Public Footer (About, Privacy, Contact, SEO links).
- [ ] Homepage (Hero, Top Stores, Categories, Today's Offers, SEO blocks).
- [ ] `/stores` Directory (A–Z index + left sidebar filters).
- [ ] `/category/{slug}` Page (Tabs, Offer Grid, Load More, SEO content).
- [ ] `/{merchant-slug}` Store Page (3-column layout, Filters, Offer Cards, Right Widgets).
- [ ] Offer Reveal Modal (Copy code + Visit Store OR Go To Website).
- [ ] **Admin Login Page** (`/admin/login`).
- [ ] **Admin Dashboard** (Stats overview).
- [ ] **Admin Stores CRUD** (List, Add, Edit, Delete).
- [ ] **Admin Categories CRUD** (List, Add, Edit, Delete).
- [ ] **Admin Offers CRUD** (List, Add, Edit, Delete - with Store linking, Categories linking).
- [ ] Mobile Responsive (filters become drawers, menu becomes hamburger).

---

## 11. Admin API Endpoints (Backend Logic)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/admin/login` | Authenticate admin, return session/JWT. |
| GET | `/api/admin/stats` | Return totals (stores, offers, clicks). |
| GET | `/api/admin/stores` | List all stores (paginated). |
| POST | `/api/admin/stores` | Create new store. |
| PUT | `/api/admin/stores/{id}` | Update store. |
| DELETE | `/api/admin/stores/{id}` | Soft delete store. |
| GET | `/api/admin/offers` | List offers with filters (store, type, status). |
| POST | `/api/admin/offers` | Create new offer. |
| PUT | `/api/admin/offers/{id}` | Update offer. |
| DELETE | `/api/admin/offers/{id}` | Soft delete offer. |
| GET | `/api/categories` | Public: Get categories with counts. |
| GET | `/api/merchants/{slug}/offers` | Public: Filtered offers for the store page. |

---

## 12. Tech Stack Recommendations (Simplified)

- **Backend:** Laravel (PHP) or Django (Python) — because they have built-in admin panels (Laravel Nova, Django Admin) which can drastically speed up CRUD development.
- **Frontend:** Blade (Laravel) or Django Templates (Server-side rendered) for SEO. Add a bit of Vanilla JS or Alpine.js for the coupon reveal modals and copy-to-clipboard functionality.
- **Database:** PostgreSQL or MySQL.
- **Caching:** Redis (optional, to speed up homepage/store pages).
- **Hosting:** Any shared hosting or VPS (DigitalOcean, AWS EC2).

---

## 13. Build Phases (Updated for Phase 1)

**Phase 1 (Current — MVP):**
1. Set up database schema (`admins`, `merchants`, `categories`, `offers`).
2. Build Admin Panel (Login + CRUD for Stores, Categories, Offers).
3. Build Public Homepage and `/stores` directory.
4. Build `/category` and `/{merchant}` dynamic pages.
5. Implement offer reveal click logic and click counter.
6. Launch and start adding coupons!

**Phase 2 (Future — Postponed):**
- Public User Registration/Login (optional).
- Favorites ("Save Store").
- Feedback/Reporting system ("This code worked").
- Browser Extension.
- User Wallet and Cashback tracking (if affiliate commissions are high enough to share).

---

## 14. Legal Note

Ensure you comply with affiliate program Terms of Service (e.g., Amazon Associates). This platform simply redirects users via your affiliate links. Do not scrape or copy competitor content—input your own store data and offers manually or via official affiliate data feeds.

---

**File Version:** Phase 1 MVP (Admin-Only)  
**Next Steps:** Start coding the Admin CRUD for `Stores` and `Offers`—that is the engine that will power your entire website!