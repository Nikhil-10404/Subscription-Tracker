import mongoose from "mongoose";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

// Extend dayjs with UTC functionality
dayjs.extend(utc);


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP"],
        default: "USD",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: true, // ✅ Ensure frequency is required
    },
    category: {
        type: String,
        enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "others"],
        required: true,
    },
    paymentMethod: {
        type: String,
        trim: true, // ✅ Fixed typo (was "trime")
        required: true,
    },
    status: {
        type: String, // ✅ Fixed typo (was "typr")
        enum: ["active", "cancelled", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: true, // ✅ Ensuring it's required
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Start date must be in the past",
        },
    },
    renewalDate: { // ✅ Fixed typo (was "renewlDate")
        type: Date,
        validate: {
            validator: function (value) {
                return this.startDate && value > this.startDate; // ✅ Ensure startDate exists before comparing
            },
            message: "Renewal date must be after the start date",
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, { timestamps: true });

// ✅ Automatically set renewalDate based on frequency
subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate && this.startDate && this.frequency) {
        this.renewalDate = new Date(this.startDate);

        console.log("Before update:", this.renewalDate); // Debug log
    
        if (this.frequency === "monthly") {
            this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
        } else {
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                yearly: 365,
            };
            this.renewalDate.setDate(this.renewalDate.getDate() + (renewalPeriods[this.frequency] || 0));
        }
    
        console.log("After update:", this.renewalDate);
    }
    
    
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
