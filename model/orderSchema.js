// orderSchema.js
import mongoose from "mongoose";

let OrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

let Order = mongoose.model("Orders", OrderSchema);
export default Order;