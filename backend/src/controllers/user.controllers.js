import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens=async (userId) => {
    try {
        const user = await User.findById(userId)
       const accessToken= user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
         await user.save ({validateBeforeSave:false})
         return { accessToken, refreshToken };

    } catch (error) {
        throw new Error("Token generation failed")
    }
}


const SingupUser= asyncHandler(async(req,res)=>{
    try {
       const {name,email,password}= req.body;

       // check if user already exsist

       const existingUser = await User.findOne({email});
       if(existingUser) throw new ApiError(409, "User already exsist")

        // create new user
        const newUser = await User.create({ name, email, password });
       const createdUser = await User.findById(newUser._id).select("-password -_createdAt");
        // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);


        if(!createdUser) throw new ApiError(500, "Unable to create user please try again Later")

       

        return res.status(201).json(
            new ApiResponse(200, "User registered successfully")
        )
 
    } catch (error) {
        const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statusCode).json(
    new ApiResponse(statusCode, null, message, false)
  );
    }
})

const loginUser= asyncHandler(async(req,res)=>{
    try {
        const { email, password } = req.body;

     if(!email ) throw ApiError(400,"Email is required")
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) throw ApiError("User does not exsist", 404);

    // 2. Check password
    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) throw ApiError("Incorrect password", 401);

    // 3. Generate tokens
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

   const options={
     httpOnly:true,
     secure:true,
   }
   return res
   .status(200)
   .cookie("accessToken", accessToken,options).
   cookie("refreshToken", refreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
            accessToken,
            refreshToken
        },
        "User logged in sucessfully"
    )
   )
    } catch (error) {
      const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statusCode).json(
    new ApiResponse(statusCode, null, message, false)
  );  
    }
})

const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
     },{
        new:true
     }
    )

    const options = {
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, "User logged out sucessfully"))
})

export {
    SingupUser,
    loginUser,
    logoutUser
}