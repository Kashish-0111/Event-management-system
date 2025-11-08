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
       const {username,email,password}= req.body;

       // check if user already exsist

       const existingUser = await User.findOne({email});
       if(existingUser) throw new ApiError(409, "User already exsist")

        // create new user
        const newUser = await User.create({ username, email, password });
       const createdUser = await User.findById(newUser._id).select("-password -_createdAt");
        // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);


        if(!createdUser) throw new ApiError(500, "Unable to create user please try again Later")

       

        return res.status(201).json(
            new ApiResponse(201, "User registered successfully")
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

     if(!email ) throw  new ApiError(400,"Email is required")
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) throw new  ApiError(404,"User does not exsist");

    // 2. Check password
    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) throw new ApiError("Incorrect password", 401);

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

const refreshAccessToken= asyncHandler(async (req,res) => {
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
  }

try {
    const decodedToken = jwt.verify(incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user= await User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401, "Invalid refesh token")
    }
  
    if(incomingRefreshToken!== user?. refreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
  
    const options = {
      httpOnly:true,
      secure: true
    }
  
   const {accessToken, newrefreshToken}= await generateAccessAndRefreshTokens(user._id)
  
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken:newrefreshToken},
        "Access token refresh"
      )
    )
} catch (error) {
   throw new ApiError(401, error?.message|| "Invalid refresh token")
}

  })

export {
    SingupUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}