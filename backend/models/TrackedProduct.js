const createModel = require("../core/model");

module.exports = createModel("TrackedProduct", {
    user_id: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
    product_url: String,
    price_target: Number,
    current_price: Number,
    created_at: { type: Date, default: Date.now },
    last_checked_at: Date
});