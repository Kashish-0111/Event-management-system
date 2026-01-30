

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.utils.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        throw new Error("Token generation failed");
    }
}

// SIGNUP - Fixed field names and added missing fields
const signupUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, phone, userType, organizationName } = req.body;  // Changed username → name, added fields

        // Validation
        if (!name || !email || !password) {
            throw new ApiError(400, "Name, email and password are required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new ApiError(409, "User already exists");

        // Create new user
        const newUser = await User.create({ 
            name,  // Changed from username
            email, 
            password,
            phone,  // Added
            userType: userType || 'user',  // Added with default
            organizationName  // Added (only for organizers)
        });

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        if (!createdUser) throw new ApiError(500, "Unable to create user");

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);

        // Fire-and-forget email trigger
        sendEmail({
            to: createdUser.email,
            subject: "Welcome to EventHub 🎉",
            html: `<h2>Hi ${createdUser.name},</h2><p>Your account has been created successfully. We're excited to have you onboard!</p>`
        });

        // Return response with token (frontend needs this)
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    user: {
                        _id: createdUser._id,
                        name: createdUser.name,
                        email: createdUser.email,
                        phone: createdUser.phone,
                        userType: createdUser.userType,
                        organizationName: createdUser.organizationName
                    },
                    token: accessToken  // Added - Frontend needs this
                },
                "User registered successfully",
                true  // success flag
            )
        );

    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return res.status(statusCode).json(
            new ApiResponse(statusCode, null, message, false)
        );
    }
});

// LOGIN - Fixed field names
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) throw new ApiError(400, "Email is required");
        if (!password) throw new ApiError(400, "Password is required");

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) throw new ApiError(404, "User does not exist");

        // Check password
        const isValid = await user.isPasswordCorrect(password);
        if (!isValid) throw new ApiError(401, "Incorrect password");

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: {
                            _id: user._id,
                            name: user.name,  // Changed from username
                            email: user.email,
                            phone: user.phone,  // Added
                            userType: user.userType,  // Changed from role
                            organizationName: user.organizationName  // Added
                        },
                        token: accessToken  // Added - Frontend needs this
                    },
                    "User logged in successfully",
                    true  // success flag
                )
            );

    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return res.status(statusCode).json(
            new ApiResponse(statusCode, null, message, false)
        );
    }
});

// LOGOUT - No changes needed
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully", true));
});

// GET CURRENT USER - New function
const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -refreshToken');
        
        if (!user) throw new ApiError(404, "User not found");

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        userType: user.userType,
                        organizationName: user.organizationName
                    }
                },
                "User fetched successfully",
                true
            )
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json(
            new ApiResponse(statusCode, null, message, false)
        );
    }
});

// REFRESH TOKEN - Small fix
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed",
                    true
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    signupUser,  // Changed from SingupUser
    loginUser,
    logoutUser,
    getCurrentUser,  // Added - New function
    refreshAccessToken
};