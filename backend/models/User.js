const createModel = require("../core/model");

module.exports = createModel("User", {
    email: String,
    phone_number: String,
    telegram_id: String,
    created_at: { type: Date, default: Date.now }
});