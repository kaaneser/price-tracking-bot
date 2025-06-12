const createModel = require('../core/model');

module.exports = createModel('PriceHistory', {
    product_id: { type: require('mongoose').Schema.Types.ObjectId, ref: 'TrackedProduct' },
    price: Number,
    date_checked: { type: Date, default: Date.now }
});