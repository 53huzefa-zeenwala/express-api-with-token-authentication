const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    segment: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    product: {
        type: String,
    },
    discountBand: {
        type: String,
    },
    unitSold: {
        type: Number,
    },
    manufacturingPrice: {
        type: String,
    },
    salesPrice: {
        type: String,
    },
    grossSales: {
        type: String,
    },
    sales: {
        type: String,
    },
    cogs: {
        type: String,
    },
    monthNumber: {
        type: Number,
    },
    monthName: {
        type: String,
    },
    year: {
        type: Number,
    },
    date: {
        type: String,
    }
})

const Order = mongoose.model('orders', orderSchema)

module.exports = Order