# Mavala

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
pnpm install
```

## Building for production

```bash
pnpm run build
```

## Local development

```bash
pnpm run dev
```

## Instances

This repository powers **different websites**:

- **Mavala France** — [Shopify Admin Access](https://admin.shopify.com/store/mavala-shop)
- **Mavala Corporate** — [Shopify Admin Access](https://admin.shopify.com/store/mavala-corporate)

Each website is connected to its own Shopify store and its own Sanity project.

**Important:**
Depending on which website you want to work on (France or Corporate), you will need to set up and load the corresponding `.env` file.

⚡ **Note:** Your `.env` file must include all the necessary API keys and environment variables required for the application to run properly:

- `PUBLIC_CHECKOUT_DOMAIN`
- `PUBLIC_STORE_DOMAIN`
- `PUBLIC_STOREFRONT_API_TOKEN`
- `PUBLIC_STOREFRONT_ID`
- `PRIVATE_STOREFRONT_API_TOKEN`
- `PRIVATE_ADMIN_API_TOKEN`
- `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- `SHOP_ID`
- `SESSION_SECRET`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- **`MAPBOX_ACCESS_TOKEN`** _(used for the Dealer Locator page with Mapbox)_
- **`PRIVATE_YOTPO_APP_KEY`** _(used for products reviews)_

---

## Multilocale Support

The project is already prepared to support **multiple locales** (multi-language websites).

Currently, multilingual support is **commented out**, because each site only uses **one default language**.

If you want to enable full multilocale functionality, you will need to **uncomment** the related code in the following files:

| File                      | What to modify                                        |
| :------------------------ | :---------------------------------------------------- |
| `src/store/($locale).tsx` | Uncomment locale-specific store logic                 |
| `src/i18n.ts`             | Uncomment i18n (internationalization) configuration   |
| `src/sanity/constant.ts`  | Uncomment locale-specific Sanity settings (LANGUAGES) |

> 🔥 **Tip:** The structure is already ready; you just need to uncomment the right parts when additional languages are needed.
