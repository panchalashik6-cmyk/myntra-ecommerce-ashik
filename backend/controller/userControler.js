require("dotenv").config();

const userModel = require("../model/UserModel");
const otpModel = require("../model/otpModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

// ==========================================
// JWT SECRET
// ==========================================

const masterkey = process.env.JWT_SECRET || "myntra-secret-key";

// ==========================================
// RESEND EMAIL
// ==========================================

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// SEND EMAIL HELPER
// ==========================================

const sendEmail = async ({ to, subject, html }) => {
    try {

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: [to],
            subject: subject,
            html: html
        });

        if (error) {
            console.log("RESEND ERROR:", error);
            throw new Error(error.message || "Email sending failed");
        }

        console.log("EMAIL SENT SUCCESSFULLY:", data);

        return data;

    } catch (error) {

        console.log("EMAIL SEND ERROR:", error);

        throw error;
    }
};

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

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!username || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });
        }

        // ==========================================
        // CLEAN EMAIL
        // ==========================================

        const cleanEmail = email.trim().toLowerCase();

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await userModel.findOne({

            email: cleanEmail

        });

        if (existingUser) {

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        // ==========================================
        // GENERATE 6 DIGIT OTP
        // ==========================================

        const otp = Math.floor(

            100000 + Math.random() * 900000

        ).toString();

        // ==========================================
        // OTP VALID FOR 5 MINUTES
        // ==========================================

        const expiresAt = new Date(

            Date.now() + 5 * 60 * 1000

        );

        // ==========================================
        // DELETE PREVIOUS OTP
        // ==========================================

        await otpModel.deleteMany({

            email: cleanEmail

        });

        // ==========================================
        // SAVE OTP
        // ==========================================

        await otpModel.create({

            username: username,

            email: cleanEmail,

            password: hashedPassword,

            otp: otp,

            expiresAt: expiresAt

        });

        // ==========================================
        // SEND OTP EMAIL USING RESEND
        // ==========================================

        await sendEmail({

            to: cleanEmail,

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

        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

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

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required"

            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // ==========================================
        // FIND OTP
        // ==========================================

        const otpData = await otpModel.findOne({

            email: cleanEmail

        });

        if (!otpData) {

            return res.status(404).json({

                success: false,

                message: "OTP not found"

            });
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (

            !otpData.expiresAt ||

            new Date(otpData.expiresAt).getTime() < Date.now()

        ) {

            await otpModel.deleteMany({

                email: cleanEmail

            });

            return res.status(410).json({

                success: false,

                message: "OTP expired"

            });
        }

        // ==========================================
        // CHECK OTP
        // ==========================================

        if (

            otpData.otp.toString() !== otp.toString()

        ) {

            return res.status(401).json({

                success: false,

                message: "Invalid OTP"

            });
        }

        // ==========================================
        // CHECK USER
        // ==========================================

        const existingUser = await userModel.findOne({

            email: cleanEmail

        });

        if (existingUser) {

            await otpModel.deleteMany({

                email: cleanEmail

            });

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });
        }

        // ==========================================
        // CREATE USER
        // ==========================================

        const data = await userModel.create({

            username: otpData.username,

            email: otpData.email,

            password: otpData.password

        });

        // ==========================================
        // DELETE OTP
        // ==========================================

        await otpModel.deleteMany({

            email: cleanEmail

        });

        // ==========================================
        // SUCCESS
        // ==========================================

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

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!username || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await userModel.findOne({

            email: cleanEmail

        });

        if (existingUser) {

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        // ==========================================
        // CREATE USER
        // ==========================================

        const data = await userModel.create({

            username: username,

            email: cleanEmail,

            password: hashedPassword

        });

        // ==========================================
        // RESPONSE
        // ==========================================

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

        let {
            email,
            password
        } = req.body;

        console.log("================================");
        console.log("LOGIN REQUEST");
        console.log("EMAIL RECEIVED:", email);
        console.log("PASSWORD RECEIVED:", !!password);

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });
        }

        // ==========================================
        // CLEAN EMAIL
        // ==========================================

        email = email.trim().toLowerCase();

        console.log("EMAIL AFTER CLEAN:", email);

        // ==========================================
        // FIND USER
        // ==========================================

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

        // ==========================================
        // PASSWORD CHECK
        // ==========================================

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

        // ==========================================
        // JWT PAYLOAD
        // ==========================================

        const payload = {

            id: data._id,

            username: data.username,

            email: data.email,

            role: data.role || "user"

        };

        // ==========================================
        // CREATE TOKEN
        // ==========================================

        const token = jwt.sign(

            payload,

            process.env.JWT_SECRET || "myntra-secret-key",

            {

                expiresIn: "1d"

            }

        );

        console.log("LOGIN SUCCESS");
        console.log("================================");

        // ==========================================
        // RESPONSE
        // ==========================================

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

// ==========================================
// VERIFY FORGOT PASSWORD OTP
// ==========================================

const verifyForgotOTP = async (req, res) => {

    try {

        let {
            email,
            otp
        } = req.body;

        console.log("=================================");
        console.log("VERIFY FORGOT OTP REQUEST");
        console.log("EMAIL RECEIVED:", email);
        console.log("OTP RECEIVED:", otp);

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required"

            });
        }

        // ==========================================
        // CLEAN EMAIL
        // ==========================================

        email = email.trim().toLowerCase();

        // ==========================================
        // CLEAN OTP
        // ==========================================

        otp = otp.toString().trim();

        console.log("EMAIL AFTER CLEAN:", email);
        console.log("OTP AFTER CLEAN:", otp);

        // ==========================================
        // FIND OTP
        // ==========================================

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

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

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

        // ==========================================
        // COMPARE OTP
        // ==========================================

        if (

            otpData.otp.toString().trim() !== otp

        ) {

            console.log("OTP DOES NOT MATCH");
            console.log("DB OTP:", otpData.otp.toString());
            console.log("USER OTP:", otp);

            return res.status(401).json({

                success: false,

                message: "Invalid OTP"

            });
        }

        console.log("OTP MATCHED SUCCESSFULLY");

        // ==========================================
        // FIND USER
        // ==========================================

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

        // ==========================================
        // GENERATE RESET TOKEN
        // ==========================================

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

        // ==========================================
        // DELETE OTP
        // ==========================================

        await otpModel.deleteMany({

            email: email

        });

        console.log("OTP DELETED");
        console.log("FORGOT OTP VERIFICATION SUCCESS");
        console.log("=================================");

        // ==========================================
        // RESPONSE
        // ==========================================

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

        let {
            email
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email) {

            return res.status(400).json({

                success: false,

                message: "Email is required"

            });
        }

        // ==========================================
        // CLEAN EMAIL
        // ==========================================

        email = email.trim().toLowerCase();

        // ==========================================
        // CHECK USER
        // ==========================================

        const user = await userModel.findOne({

            email: email

        });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Email not registered"

            });
        }

        // ==========================================
        // GENERATE 6 DIGIT OTP
        // ==========================================

        const otp = Math.floor(

            100000 + Math.random() * 900000

        ).toString();

        // ==========================================
        // OTP VALID FOR 5 MINUTES
        // ==========================================

        const expiresAt = new Date(

            Date.now() + 5 * 60 * 1000

        );

        // ==========================================
        // DELETE OLD OTP
        // ==========================================

        await otpModel.deleteMany({

            email: email

        });

        // ==========================================
        // SAVE FORGOT PASSWORD OTP
        // ==========================================

        await otpModel.create({

            email: email,

            otp: otp,

            expiresAt: expiresAt

        });

        // ==========================================
        // SEND RESET OTP USING RESEND
        // ==========================================

        await sendEmail({

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

        // ==========================================
        // SUCCESS
        // ==========================================

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

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!password) {

            return res.status(400).json({

                success: false,

                message: "Password is required"

            });
        }

        // ==========================================
        // VERIFY RESET TOKEN
        // ==========================================

        const data = jwt.verify(

            token,

            "reset-secret-key"

        );

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashpassword = await bcrypt.hash(

            password,

            10

        );

        // ==========================================
        // UPDATE PASSWORD
        // ==========================================

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

        // ==========================================
        // RESPONSE
        // ==========================================

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

        const user = await userModel
            .findById(req.user.id)
            .select("-password")
            .populate("wishlist");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });
        }

        res.json({

            success: true,

            user

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const allowed = [

            "username",

            "phone",

            "gender",

            "city",

            "bio"

        ];

        const updates = {};

        allowed.forEach((key) => {

            if (req.body[key] !== undefined) {

                updates[key] = req.body[key];

            }

        });

        const user = await userModel
            .findByIdAndUpdate(

                req.user.id,

                updates,

                {

                    new: true,

                    runValidators: true

                }

            )
            .select("-password");

        res.json({

            success: true,

            message: "Profile updated successfully",

            user

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });
    }
};

// ==========================================
// GET WISHLIST
// ==========================================

const getWishlist = async (req, res) => {

    try {

        const user = await userModel
            .findById(req.user.id)
            .populate("wishlist");

        res.json({

            success: true,

            count: user?.wishlist?.length || 0,

            products: user?.wishlist || []

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
};

// ==========================================
// ADD WISHLIST
// ==========================================

const addWishlist = async (req, res) => {

    try {

        const {
            productId
        } = req.body;

        if (!productId) {

            return res.status(400).json({

                success: false,

                message: "productId is required"

            });
        }

        const user = await userModel.findById(

            req.user.id

        );

        if (
            !user.wishlist.some(
                (id) => id.toString() === productId.toString()
            )
        ) {

            user.wishlist.push(productId);

        }

        await user.save();

        res.json({

            success: true,

            message: "Added to wishlist",

            wishlist: user.wishlist

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });
    }
};

// ==========================================
// REMOVE WISHLIST
// ==========================================

const removeWishlist = async (req, res) => {

    try {

        const user = await userModel.findByIdAndUpdate(

            req.user.id,

            {

                $pull: {

                    wishlist: req.params.productId

                }

            },

            {

                new: true

            }

        );

        res.json({

            success: true,

            message: "Removed from wishlist",

            wishlist: user.wishlist

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });
    }
};

// ==========================================
// CREATE ADMIN
// ==========================================

const createAdmin = async (req, res) => {

    try {

        const {
            setupKey,
            username,
            email,
            password
        } = req.body;

        const expected = process.env.ADMIN_SETUP_KEY;

        // ==========================================
        // CHECK SETUP KEY
        // ==========================================

        if (
            !expected ||
            setupKey !== expected
        ) {

            return res.status(403).json({

                success: false,

                message: "Invalid admin setup key"

            });
        }

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "username, email and password are required"

            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // ==========================================
        // CHECK EXISTING
        // ==========================================

        const existing = await userModel.findOne({

            email: cleanEmail

        });

        if (existing) {

            return res.status(409).json({

                success: false,

                message: "Email already registered"

            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashed = await bcrypt.hash(

            password,

            10

        );

        // ==========================================
        // CREATE ADMIN
        // ==========================================

        const admin = await userModel.create({

            username,

            email: cleanEmail,

            password: hashed,

            role: "admin"

        });

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            message: "Admin created successfully",

            user: {

                id: admin._id,

                username,

                email: cleanEmail,

                role: "admin"

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });
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