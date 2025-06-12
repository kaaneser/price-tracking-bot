## 📊 Database Design
### Users Table:
| Field | Type | Description |
|--|--|--|
| `user_id` | ObjectId | Unique identifier for the user |
| `email` | String | User's email address |
| `phone_number` | String | User's phone number (for SMS) |
| `telegram_id` | String | User's Telegram ID (for Telegram) |
| `created_at` | Date | Date when the account was created |

### Tracked Products Table:

| Field | Type | Description |
|--|--|--|
| `product_id` | ObjectId | Unique identifier for the product |
| `user_id` | ObjectId | User's unique identifier |
| `product_url` | String | URL of the product |
| `price_target` | Number | The price target set by the user |
| `current_price` | Number | The current price of the product |
| `created_at` | Date | Date when tracking started for the product |
| `last_checked_at` | Date | Last date when the product's price was checked |

### Price History Table:
| Field | Type | Description |
|--|--|--|
| `product_id` | ObjectId | Product identifier |
| `price` | Number | Price of the product |
| `date_checked` | Date | Date when the price was checked |