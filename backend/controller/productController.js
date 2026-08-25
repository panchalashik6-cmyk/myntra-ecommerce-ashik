const Product = require("../model/ProductModel");

const seedData = [
    {
        name: "Men Slim Fit Casual Shirt",
        brand: "Roadster",
        description: "Comfortable cotton casual shirt with a modern slim fit.",
        category: "men",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80"
        ],
        price: 799,
        oldPrice: 1599,
        discount: 50,
        rating: 4.4,
        ratingCount: 128,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "White"],
        stock: 25
    },

    {
        name: "Women Floral Printed Dress",
        brand: "Tokyo Talkies",
        description: "Easy-breezy floral dress designed for everyday style.",
        category: "women",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
        ],
        price: 999,
        oldPrice: 1999,
        discount: 50,
        rating: 4.5,
        ratingCount: 214,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Pink", "Green"],
        stock: 18
    },

    {
        name: "Kids Printed Hoodie",
        brand: "H&M Kids",
        description: "Soft everyday hoodie with a playful printed front.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80"
        ],
        price: 699,
        oldPrice: 1299,
        discount: 46,
        rating: 4.3,
        ratingCount: 97,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Black", "Yellow"],
        stock: 30
    },

    {
        name: "Minimal Ceramic Table Lamp",
        brand: "Home Centre",
        description: "Minimal ceramic lamp for bedroom and living-room decor.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1199,
        oldPrice: 2499,
        discount: 52,
        rating: 4.6,
        ratingCount: 61,
        sizes: ["Free Size"],
        colors: ["White"],
        stock: 12
    },

    {
        name: "Hydrating Face Serum",
        brand: "Minimalist",
        description: "Lightweight daily serum for a fresh and hydrated feel.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80"
        ],
        price: 599,
        oldPrice: 799,
        discount: 25,
        rating: 4.5,
        ratingCount: 342,
        sizes: ["Free Size"],
        colors: ["Clear"],
        stock: 40
    },

    {
        name: "Men Running Sneakers",
        brand: "HRX",
        description: "Lightweight running sneakers with cushioned comfort.",
        category: "men",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1499,
        oldPrice: 2999,
        discount: 50,
        rating: 4.6,
        ratingCount: 289,
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Red", "Black"],
        stock: 15
    }
];


// ======================================================
// MORE PRODUCTS - 30 PRODUCTS
// ======================================================

const moreProducts = [

    // ==================================================
    // MEN - 6
    // ==================================================

    {
        name: "Men Regular Fit Denim Jacket",
        brand: "Roadster",
        description: "Classic denim jacket for casual everyday styling.",
        category: "men",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1299,
        oldPrice: 2499,
        discount: 48,
        rating: 4.5,
        ratingCount: 156,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Black"],
        stock: 20
    },

    {
        name: "Men Solid Polo T-Shirt",
        brand: "U.S. Polo Assn.",
        description: "Comfortable cotton polo t-shirt for everyday wear.",
        category: "men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
        ],
        price: 699,
        oldPrice: 1299,
        discount: 46,
        rating: 4.4,
        ratingCount: 201,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Navy"],
        stock: 35
    },

    {
        name: "Men Slim Fit Jeans",
        brand: "Levis",
        description: "Modern slim fit jeans with comfortable stretch fabric.",
        category: "men",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1599,
        oldPrice: 2999,
        discount: 47,
        rating: 4.6,
        ratingCount: 310,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Blue", "Black"],
        stock: 22
    },

    {
        name: "Men Casual Sneakers",
        brand: "Puma",
        description: "Stylish casual sneakers designed for everyday comfort.",
        category: "men",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1799,
        oldPrice: 3499,
        discount: 49,
        rating: 4.5,
        ratingCount: 188,
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["White", "Black"],
        stock: 18
    },

    {
        name: "Men Formal Cotton Trousers",
        brand: "Van Heusen",
        description: "Smart formal trousers suitable for office and occasions.",
        category: "men",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1199,
        oldPrice: 2299,
        discount: 48,
        rating: 4.3,
        ratingCount: 94,
        sizes: ["30", "32", "34", "36"],
        colors: ["Black", "Grey", "Navy"],
        stock: 25
    },

    {
        name: "Men Printed Casual Shirt",
        brand: "HRX",
        description: "Trendy printed shirt with a relaxed casual fit.",
        category: "men",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80"
        ],
        price: 899,
        oldPrice: 1799,
        discount: 50,
        rating: 4.4,
        ratingCount: 121,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Green"],
        stock: 28
    },


    // ==================================================
    // WOMEN - 6
    // ==================================================

    {
        name: "Women Solid Kurta",
        brand: "Libas",
        description: "Elegant everyday kurta with a comfortable fit.",
        category: "women",
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80"
        ],
        price: 799,
        oldPrice: 1599,
        discount: 50,
        rating: 4.5,
        ratingCount: 240,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Pink", "Blue", "Green"],
        stock: 30
    },

    {
        name: "Women High Rise Jeans",
        brand: "Roadster",
        description: "Stylish high rise jeans with a comfortable stretch.",
        category: "women",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1199,
        oldPrice: 2399,
        discount: 50,
        rating: 4.4,
        ratingCount: 178,
        sizes: ["26", "28", "30", "32", "34"],
        colors: ["Blue", "Black"],
        stock: 24
    },

    {
        name: "Women Casual Top",
        brand: "Tokyo Talkies",
        description: "Trendy casual top perfect for everyday outfits.",
        category: "women",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80"
        ],
        price: 599,
        oldPrice: 1199,
        discount: 50,
        rating: 4.3,
        ratingCount: 145,
        sizes: ["XS", "S", "M", "L"],
        colors: ["White", "Pink", "Black"],
        stock: 32
    },

    {
        name: "Women Handbag",
        brand: "Lavie",
        description: "Spacious and stylish handbag for everyday use.",
        category: "women",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
        ],
        price: 999,
        oldPrice: 1999,
        discount: 50,
        rating: 4.6,
        ratingCount: 220,
        sizes: ["Free Size"],
        colors: ["Black", "Brown"],
        stock: 19
    },

    {
        name: "Women Party Wear Heels",
        brand: "Mochi",
        description: "Elegant heels designed for parties and special occasions.",
        category: "women",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1299,
        oldPrice: 2499,
        discount: 48,
        rating: 4.5,
        ratingCount: 113,
        sizes: ["4", "5", "6", "7", "8"],
        colors: ["Black", "Red"],
        stock: 15
    },

    {
        name: "Women Summer Jumpsuit",
        brand: "SASSAFRAS",
        description: "Comfortable printed jumpsuit for a stylish summer look.",
        category: "women",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1099,
        oldPrice: 2199,
        discount: 50,
        rating: 4.4,
        ratingCount: 137,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Yellow", "Green"],
        stock: 20
    },


    // ==================================================
    // KIDS - 6
    // ==================================================

    {
        name: "Kids Cotton T-Shirt",
        brand: "H&M Kids",
        description: "Soft cotton t-shirt designed for active kids.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80"
        ],
        price: 399,
        oldPrice: 799,
        discount: 50,
        rating: 4.4,
        ratingCount: 82,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Blue", "Yellow"],
        stock: 40
    },

    {
        name: "Kids Denim Jacket",
        brand: "Allen Solly Junior",
        description: "Stylish denim jacket for kids.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
        ],
        price: 899,
        oldPrice: 1799,
        discount: 50,
        rating: 4.5,
        ratingCount: 75,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Blue"],
        stock: 18
    },

    {
        name: "Kids Casual Sneakers",
        brand: "Skechers",
        description: "Comfortable sneakers for school and outdoor activities.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80"
        ],
        price: 799,
        oldPrice: 1499,
        discount: 47,
        rating: 4.6,
        ratingCount: 102,
        sizes: ["10", "11", "12", "13", "1"],
        colors: ["Blue", "White"],
        stock: 21
    },

    {
        name: "Kids Girls Floral Dress",
        brand: "Max Kids",
        description: "Beautiful floral dress for casual occasions.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
        ],
        price: 699,
        oldPrice: 1399,
        discount: 50,
        rating: 4.5,
        ratingCount: 91,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Pink", "White"],
        stock: 26
    },

    {
        name: "Kids Jogger Pants",
        brand: "Puma Kids",
        description: "Comfortable joggers for everyday play and activities.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
        ],
        price: 599,
        oldPrice: 999,
        discount: 40,
        rating: 4.3,
        ratingCount: 68,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Grey", "Black"],
        stock: 30
    },

    {
        name: "Kids Winter Sweatshirt",
        brand: "United Colors of Benetton",
        description: "Warm and comfortable sweatshirt for winter days.",
        category: "kids",
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80"
        ],
        price: 649,
        oldPrice: 1299,
        discount: 50,
        rating: 4.4,
        ratingCount: 73,
        sizes: ["4Y", "6Y", "8Y", "10Y"],
        colors: ["Red", "Blue"],
        stock: 22
    },


    // ==================================================
    // HOME & LIVING - 6
    // ==================================================

    {
        name: "Decorative Wall Mirror",
        brand: "Home Centre",
        description: "Modern decorative mirror for bedroom and living room.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
        ],
        price: 1499,
        oldPrice: 2999,
        discount: 50,
        rating: 4.6,
        ratingCount: 85,
        sizes: ["Free Size"],
        colors: ["Gold"],
        stock: 12
    },

    {
        name: "Cotton Cushion Set",
        brand: "Story@Home",
        description: "Soft decorative cushion set for your living room.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
        ],
        price: 499,
        oldPrice: 999,
        discount: 50,
        rating: 4.4,
        ratingCount: 72,
        sizes: ["Free Size"],
        colors: ["Beige", "Grey"],
        stock: 35
    },

    {
        name: "Modern Ceramic Vase",
        brand: "Ellementry",
        description: "Minimal ceramic vase for modern home decoration.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=900&q=80"
        ],
        price: 699,
        oldPrice: 1299,
        discount: 46,
        rating: 4.5,
        ratingCount: 64,
        sizes: ["Free Size"],
        colors: ["White", "Brown"],
        stock: 20
    },

    {
        name: "Wooden Table Clock",
        brand: "Home Centre",
        description: "Elegant wooden clock for desk and home decoration.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
        ],
        price: 799,
        oldPrice: 1499,
        discount: 47,
        rating: 4.3,
        ratingCount: 55,
        sizes: ["Free Size"],
        colors: ["Brown"],
        stock: 16
    },

    {
        name: "Soft Cotton Bedsheet",
        brand: "Spaces",
        description: "Premium cotton bedsheet with a comfortable soft finish.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80"
        ],
        price: 899,
        oldPrice: 1799,
        discount: 50,
        rating: 4.5,
        ratingCount: 143,
        sizes: ["Double"],
        colors: ["White", "Blue"],
        stock: 28
    },

    {
        name: "Decorative Indoor Plant",
        brand: "Pure Home + Living",
        description: "Artificial indoor plant for modern home decor.",
        category: "home-living",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80"
        ],
        price: 599,
        oldPrice: 999,
        discount: 40,
        rating: 4.4,
        ratingCount: 89,
        sizes: ["Free Size"],
        colors: ["Green"],
        stock: 25
    },


    // ==================================================
    // BEAUTY - 6
    // ==================================================

    {
        name: "Vitamin C Face Serum",
        brand: "Mamaearth",
        description: "Vitamin C serum for a fresh and radiant looking skin.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
        ],
        price: 499,
        oldPrice: 799,
        discount: 38,
        rating: 4.5,
        ratingCount: 421,
        sizes: ["Free Size"],
        colors: ["Clear"],
        stock: 45
    },

    {
        name: "Matte Lipstick",
        brand: "Maybelline",
        description: "Long lasting matte lipstick with a smooth finish.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80"
        ],
        price: 399,
        oldPrice: 699,
        discount: 43,
        rating: 4.6,
        ratingCount: 512,
        sizes: ["Free Size"],
        colors: ["Red", "Pink", "Nude"],
        stock: 50
    },

    {
        name: "Hydrating Face Moisturizer",
        brand: "Cetaphil",
        description: "Lightweight moisturizer for daily skin hydration.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"
        ],
        price: 699,
        oldPrice: 999,
        discount: 30,
        rating: 4.7,
        ratingCount: 632,
        sizes: ["Free Size"],
        colors: ["White"],
        stock: 38
    },

    {
        name: "Shampoo For Daily Care",
        brand: "L'Oreal",
        description: "Gentle shampoo for clean and healthy looking hair.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=80"
        ],
        price: 449,
        oldPrice: 699,
        discount: 36,
        rating: 4.4,
        ratingCount: 287,
        sizes: ["Free Size"],
        colors: ["White"],
        stock: 42
    },

    {
        name: "Face Wash",
        brand: "The Derma Co",
        description: "Gentle face wash for everyday cleansing.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80"
        ],
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.5,
        ratingCount: 351,
        sizes: ["Free Size"],
        colors: ["Clear"],
        stock: 55
    },

    {
        name: "Perfume For Women",
        brand: "Fogg",
        description: "Fresh fragrance suitable for everyday occasions.",
        category: "beauty",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
        ],
        price: 599,
        oldPrice: 999,
        discount: 40,
        rating: 4.3,
        ratingCount: 198,
        sizes: ["Free Size"],
        colors: ["Pink"],
        stock: 30
    }
];



// Selected products intentionally have multiple gallery images.
// The rest keep a single image, so the catalog feels realistic without
// making every product look like a duplicate gallery.
const multiImageCatalog = {
    "Men Regular Fit Denim Jacket": [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1520975958225-9e4f4f0f5f5b?auto=format&fit=crop&w=900&q=80"
    ],
    "Men Slim Fit Jeans": [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80"
    ],
    "Women Solid Kurta": [
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
    ],
    "Women Casual Top": [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80"
    ],
    "Kids Cotton T-Shirt": [
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80"
    ],
    "Kids Denim Jacket": [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
    ],
    "Decorative Wall Mirror": [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
    ],
    "Modern Ceramic Vase": [
        "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=80"
    ],
    "Vitamin C Face Serum": [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80"
    ],
    "Perfume For Women": [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
    ]
};

for (const item of [...seedData, ...moreProducts]) {
    if (multiImageCatalog[item.name]) {
        item.images = multiImageCatalog[item.name];
        item.image = item.images[0];
    }
}

// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getProducts = async (req, res) => {
    try {
        const { category, search, sort = "newest", minPrice, maxPrice, page = 1, limit = 40 } = req.query;
        const filter = {};

        if (category && category !== "all") filter.category = category.toLowerCase();
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        if (minPrice !== undefined && minPrice !== "") filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
        if (maxPrice !== undefined && maxPrice !== "") filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

        const sortMap = {
            newest: { createdAt: -1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating: { rating: -1, ratingCount: -1 },
            discount: { discount: -1 },
            popularity: { ratingCount: -1, rating: -1 }
        };

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(100, Math.max(1, Number(limit) || 40));

        // Demo/catalog safety: older seed operations could create the same
        // product more than once. De-duplicate by product name before sending
        // products to the frontend so Men/Women/Kids/Home/Beauty never show
        // the same catalog item twice.
        const allProducts = await Product.find(filter)
            .sort(sortMap[sort] || sortMap.newest);

        const uniqueProducts = [];
        const seenNames = new Set();

        for (const product of allProducts) {
            const uniqueKey = String(product.name || "").trim().toLowerCase();
            if (seenNames.has(uniqueKey)) continue;
            seenNames.add(uniqueKey);
            uniqueProducts.push(product);
        }

        const total = uniqueProducts.length;
        const start = (pageNumber - 1) * limitNumber;
        const products = uniqueProducts.slice(start, start + limitNumber);

        res.json({
            success: true,
            count: products.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            products
        });
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product });
    } catch {
        res.status(400).json({ success: false, message: "Invalid product id" });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    } catch {
        res.status(400).json({ success: false, message: "Invalid product id" });
    }
};

const seedProducts = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return res.json({ success: true, message: "Products already exist", count });
        const products = await Product.insertMany(seedData);
        res.status(201).json({ success: true, message: "Demo products inserted", count: products.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const seedMoreProducts = async (req, res) => {
    try {
        // Clean duplicate catalog records created by previous seed calls.
        const duplicateGroups = await Product.aggregate([
            { $group: { _id: "$name", ids: { $push: "$_id" }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        let removedDuplicates = 0;
        for (const group of duplicateGroups) {
            // Keep the first document and remove the rest.
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
            const exists = await Product.findOne({ name: product.name });

            if (exists) {
                await Product.updateOne(
                    { _id: exists._id },
                    { $set: product }
                );
                updated++;
            } else {
                await Product.create(product);
                inserted++;
            }
        }

        const totalProducts = await Product.countDocuments();
        res.status(201).json({
            success: true,
            message: "Catalog synced successfully. Duplicate products removed and demo products updated.",
            inserted,
            updated,
            removedDuplicates,
            totalProducts
        });
    } catch (error) {
        console.error("SEED MORE PRODUCTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts, seedMoreProducts, seedData, moreProducts };
