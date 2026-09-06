require("dotenv").config();

const userModel = require("../model/UserModel");
const otpModel = require("../model/otpModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// ==========================================
// JWT SECRET
// ==========================================

const masterkey = process.env.JWT_SECRET || "myntra-secret-key";


// ==========================================
// NODEMAILER
// ==========================================
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// ==========================================
// MAIL SERVER CHECK
// ==========================================

transporter.verify((error) => {

    if (error) {

        console.log("MAIL ERROR:", error.message);

    } else {

        console.log("MAIL SERVER READY");

    }

});


// ==========================================
// SEND OTP
// ==========================================

const sendOTP = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        if (!username || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }


        const existingUser = await userModel.findOne({

            email: email

        });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });

        }


        const hashedPassword = await bcrypt.hash(

            password,

            10

        );


        // Generate 6 digit OTP

        const otp = Math.floor(

            100000 + Math.random() * 900000

        ).toString();


        // OTP valid for 5 minutes

        const expiresAt = new Date(

            Date.now() + 5 * 60 * 1000

        );


        // Delete previous OTP

        await otpModel.deleteMany({

            email: email

        });


        // Save OTP

        await otpModel.create({

            username: username,

            email: email,

            password: hashedPassword,

            otp: otp,

            expiresAt: expiresAt

        });


        // Send email

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Myntra - Email Verification OTP",

            html: `

                <div style="

                    font-family: Arial, sans-serif;

                    max-width: 500px;

                    margin: 20px auto;

                    padding: 30px;

                    border: 1px solid #ddd;

                    border-radius: 12px;

                    background: #ffffff;

                ">

                    <h1 style="

                        text-align: center;

                        color: #ff3f6c;

                    ">

                        MYNTRA

                    </h1>


                    <h2>

                        Hello ${username},

                    </h2>


                    <p>

                        Thank you for creating your Myntra account.

                    </p>


                    <p>

                        Your email verification OTP is:

                    </p>


                    <h1 style="

                        text-align: center;

                        color: #ff3f6c;

                        letter-spacing: 10px;

                    ">

                        ${otp}

                    </h1>


                    <p>

                        This OTP is valid for 5 minutes.

                    </p>


                    <p>

                        Please do not share this OTP with anyone.

                    </p>


                    <hr>


                    <p style="

                        text-align: center;

                        color: #777;

                        font-size: 12px;

                    ">

                        Myntra Ecommerce

                    </p>

                </div>

            `

        });


        return res.status(200).json({

            success: true,

            message: "OTP sent successfully to your email"

        });


    } catch (error) {

        console.log("SEND OTP ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// VERIFY OTP
// ==========================================

const verifyOTP = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required"

            });

        }


        const otpData = await otpModel.findOne({

            email: email

        });


        if (!otpData) {

            return res.status(404).json({

                success: false,

                message: "OTP not found"

            });

        }


        // Check expiry

        if (

            !otpData.expiresAt ||

            new Date(otpData.expiresAt).getTime() < Date.now()

        ) {

            await otpModel.deleteMany({

                email: email

            });


            return res.status(410).json({

                success: false,

                message: "OTP expired"

            });

        }


        // Check OTP

        if (

            otpData.otp.toString() !== otp.toString()

        ) {

            return res.status(401).json({

                success: false,

                message: "Invalid OTP"

            });

        }


        // Check user

        const existingUser = await userModel.findOne({

            email: email

        });


        if (existingUser) {

            await otpModel.deleteMany({

                email: email

            });

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });

        }


        // Create user

        const data = await userModel.create({

            username: otpData.username,

            email: otpData.email,

            password: otpData.password

        });


        // Delete OTP

        await otpModel.deleteMany({

            email: email

        });


        return res.status(201).json({

            success: true,

            message: "Signup Successfully",

            user: {

                id: data._id,

                username: data.username,

                email: data.email,
                role: data.role || "user"

            }

        });


    } catch (error) {

        console.log("VERIFY OTP ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        if (!username || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }


        const existingUser = await userModel.findOne({

            email: email

        });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });

        }


        const hashedPassword = await bcrypt.hash(

            password,

            10

        );


        const data = await userModel.create({

            username: username,

            email: email,

            password: hashedPassword

        });


        return res.status(201).json({

            success: true,

            message: "Signup Successfully",

            user: {

                id: data._id,

                username: data.username,

                email: data.email,

                role: data.role || "user"

            }

        });


    } catch (error) {

        console.log("REGISTER ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        console.log("================================");
        console.log("LOGIN REQUEST");
        console.log("EMAIL RECEIVED:", email);
        console.log("PASSWORD RECEIVED:", !!password);

        // Email clean
        email = email.trim().toLowerCase();

        console.log("EMAIL AFTER CLEAN:", email);

        // Find user
        const data = await userModel.findOne({
            email: email
        });

        console.log("USER FOUND:", !!data);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("USER ID:", data._id);
        console.log("USERNAME:", data.username);
        console.log("DATABASE EMAIL:", data.email);

        // Password check
        const passwordMatch = await bcrypt.compare(
            password,
            data.password
        );

        console.log("PASSWORD MATCH:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        // JWT payload
        const payload = {
            id: data._id,
            username: data.username,
            email: data.email,
            role: data.role || "user"
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || "myntra-secret-key",
            {
                expiresIn: "1d"
            }
        );

        console.log("LOGIN SUCCESS");
        console.log("================================");

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: data._id,
                username: data.username,
                email: data.email,
                role: data.role || "user"
            }
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ==========================================
// VERIFY TOKEN
// ==========================================

const verifytoken = (req, res, next) => {

    try {

        const authheader = req.headers.authorization;


        if (!authheader) {

            return res.status(401).json({

                success: false,

                message: "Token required"

            });

        }


        const token = authheader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Token required"

            });

        }


        const data = jwt.verify(

            token,

            masterkey

        );


        req.user = data;


        next();


    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token"

        });

    }

};


const verifyForgotOTP = async (req, res) => {
    try {
        let { email, otp } = req.body;

        console.log("=================================");
        console.log("VERIFY FORGOT OTP REQUEST");
        console.log("EMAIL RECEIVED:", email);
        console.log("OTP RECEIVED:", otp);

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // Clean email
        email = email.trim().toLowerCase();

        // Clean OTP
        otp = otp.toString().trim();

        console.log("EMAIL AFTER CLEAN:", email);
        console.log("OTP AFTER CLEAN:", otp);

        // Find OTP
        const otpData = await otpModel.findOne({
            email: email
        });

        console.log("OTP DATA FOUND:", !!otpData);

        if (!otpData) {
            console.log("NO OTP FOUND FOR:", email);

            return res.status(404).json({
                success: false,
                message: "OTP not found or expired. Please request a new OTP."
            });
        }

        console.log("DATABASE OTP:", otpData.otp);
        console.log("DATABASE EMAIL:", otpData.email);
        console.log("OTP EXPIRY:", otpData.expiresAt);
        console.log("CURRENT TIME:", new Date());

        // Check expiry
        if (
            !otpData.expiresAt ||
            new Date(otpData.expiresAt).getTime() < Date.now()
        ) {
            console.log("OTP EXPIRED");

            await otpModel.deleteMany({
                email: email
            });

            return res.status(410).json({
                success: false,
                message: "OTP expired. Please request a new OTP."
            });
        }

        // Compare OTP
        if (otpData.otp.toString().trim() !== otp) {

            console.log("OTP DOES NOT MATCH");
            console.log("DB OTP:", otpData.otp.toString());
            console.log("USER OTP:", otp);

            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        console.log("OTP MATCHED SUCCESSFULLY");

        // Find user
        const user = await userModel.findOne({
            email: email
        });

        console.log("USER FOUND:", !!user);

        if (!user) {
            await otpModel.deleteMany({
                email: email
            });

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            "reset-secret-key",
            {
                expiresIn: "10m"
            }
        );

        console.log("RESET TOKEN GENERATED");

        // Delete OTP after successful verification
        await otpModel.deleteMany({
            email: email
        });

        console.log("OTP DELETED");
        console.log("FORGOT OTP VERIFICATION SUCCESS");
        console.log("=================================");

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            resetToken: resetToken
        });

    } catch (error) {

        console.log("=================================");
        console.log("VERIFY FORGOT OTP ERROR:");
        console.log(error);
        console.log("=================================");

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {
    try {

        let { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        email = email.trim().toLowerCase();

        // Check user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not registered"
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP valid for 5 minutes
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Delete old OTP
        await otpModel.deleteMany({
            email
        });

        // Save forgot password OTP
        await otpModel.create({
            email,
            otp,
            expiresAt
        });

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Myntra - Password Reset OTP",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: 20px auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h1 style="
                        text-align: center;
                        color: #ff3f6c;
                    ">
                        MYNTRA
                    </h1>

                    <h2>
                        Password Reset
                    </h2>

                    <p>
                        Hello ${user.username},
                    </p>

                    <p>
                        We received a request to reset your Myntra
                        account password.
                    </p>

                    <p>
                        Your password reset OTP is:
                    </p>

                    <h1 style="
                        text-align: center;
                        color: #ff3f6c;
                        letter-spacing: 10px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for 5 minutes.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <hr>

                    <p style="
                        text-align: center;
                        color: #777;
                        font-size: 12px;
                    ">
                        Myntra Ecommerce
                    </p>

                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully"
        });

    } catch (error) {

        console.log("FORGOT PASSWORD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {

    try {

        const token = req.params.token;

        const {
            password
        } = req.body;


        if (!password) {

            return res.status(400).json({

                success: false,

                message: "Password is required"

            });

        }


        const data = jwt.verify(

            token,

            "reset-secret-key"

        );


        const hashpassword = await bcrypt.hash(

            password,

            10

        );


        const user = await userModel.findByIdAndUpdate(

            data.id,

            {

                password: hashpassword

            },

            {

                new: true

            }

        );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            message: "Password reset successfully"

        });


    } catch (error) {

        console.log("RESET PASSWORD ERROR:", error);

        return res.status(401).json({

            success: false,

            message: "Invalid or expired reset token"

        });

    }

};



// ==========================================
// PROFILE
// ==========================================
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password").populate("wishlist");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const allowed = ["username", "phone", "gender", "city", "bio"];
        const updates = {};
        allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
        const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-password");
        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate("wishlist");
        res.json({ success: true, count: user?.wishlist?.length || 0, products: user?.wishlist || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: "productId is required" });
        const user = await userModel.findById(req.user.id);
        if (!user.wishlist.some((id) => id.toString() === productId.toString())) user.wishlist.push(productId);
        await user.save();
        res.json({ success: true, message: "Added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const removeWishlist = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.productId } }, { new: true });
        res.json({ success: true, message: "Removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { setupKey, username, email, password } = req.body;
        const expected = process.env.ADMIN_SETUP_KEY;
        if (!expected || setupKey !== expected) return res.status(403).json({ success: false, message: "Invalid admin setup key" });
        if (!username || !email || !password) return res.status(400).json({ success: false, message: "username, email and password are required" });
        const existing = await userModel.findOne({ email });
        if (existing) return res.status(409).json({ success: false, message: "Email already registered" });
        const hashed = await bcrypt.hash(password, 10);
        const admin = await userModel.create({ username, email, password: hashed, role: "admin" });
        res.status(201).json({ success: true, message: "Admin created successfully", user: { id: admin._id, username, email, role: "admin" } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    register,
    sendOTP,
    verifyOTP,
    login,
    verifytoken,

    forgotPassword,
    verifyForgotOTP,
    resetPassword,

    getProfile,
    updateProfile,
    getWishlist,
    addWishlist,
    removeWishlist,
    createAdmin
};