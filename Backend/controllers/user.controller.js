import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"




export const register = async (req, res) => {
    try {
        const { firstName, lastName, email,  password } = req.body;
        if (!firstName || !lastName || !email ||  !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // const existingUserByUsername = await User.findOne({ userName: userName });

        // if (existingUserByUsername) {
        //     return res.status(400).json({ success: false, message: "Username already exists" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "Account Created Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to register"
        })

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        let user = await User.findOne({email: email})
        if(!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).cookie("token", token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite:"strict"}).json({
            message: `Welcome back, ${user.firstName}`,
            user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login"
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(error);
        
    }
}
