require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../model/ProductModel");
const { seedData, moreProducts } = require("../controller/productController");

async function syncCatalog() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected. Syncing catalog...");

        const duplicateGroups = await Product.aggregate([
            { $group: { _id: "$name", ids: { $push: "$_id" }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        let removedDuplicates = 0;
        for (const group of duplicateGroups) {
            const idsToDelete = group.ids.slice(1);
            if (idsToDelete.length) {
                const result = await Product.deleteMany({ _id: { $in: idsToDelete } });
                removedDuplicates += result.deletedCount || 0;
            }
        }

        const catalog = [...seedData, ...moreProducts];
        let inserted = 0;
        let updated = 0;

        for (const product of catalog) {
            const result = await Product.updateOne(
                { name: product.name },
                { $set: product },
                { upsert: true }
            );

            if (result.upsertedCount) inserted++;
            else if (result.matchedCount) updated++;
        }

        const total = await Product.countDocuments();
        console.log(`Done. Inserted: ${inserted}, Updated: ${updated}, Duplicates removed: ${removedDuplicates}, Total: ${total}`);
    } catch (error) {
        console.error("Catalog sync failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

syncCatalog();
