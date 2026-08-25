const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: 
        { type: String,
             required: true,
              trim: true
             },


        brand:
         { 
            type: String,
             default: "Myntra"
             },
        description: 
        { type: String,
             required: true
             },

        category: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        image:
         { type: String,
             required: true
             },
        images:
         { type: [String],
             default: [] },
        price:
        { type: Number, 
            required: true,
             min: 0 },

        oldPrice:
         { type: Number,
             required: true,
              min: 0 
            },
        discount: 
        { type: Number,
             default: 0
             },
        rating:
         { 
            type: Number,
            default: 4.2, 
            min: 0,
             max: 5 
            },

        ratingCount:
         { type: Number,
             default: 0 
            },

        sizes:
         { type: [String],
             default: ["S", "M", "L", "XL"] },
        colors:
         { type: [String], default: []

          },
        stock: { 
            type: Number, 
            default: 20, min: 0 }
    },
    { 
        timestamps: true
     }
);

module.exports = mongoose.model("Product", productSchema);
