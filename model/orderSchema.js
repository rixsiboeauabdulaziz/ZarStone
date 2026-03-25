import mongoose from "mongoose";

let OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
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