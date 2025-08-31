import {asyncshendelar} from '../utils/asyncshendelar.js'
import {User} from '../models/user.model.js'
import { ApiErrors } from '../utils/ApiErrors.js';
import {  uploadOnCloudinary} from '../utils/clouldinery.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const generateRefreshToken = async (userId) =>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return { accessToken, refreshToken };
    
  } catch (error) {
    throw new ApiErrors(500, "Error generating refresh and access token");
    
  }
}

const registerUser = asyncshendelar( async (req, res) =>{
   
// get user detailes
// validation -- not empty
// check if user already exists: username, ElementInternal
// cheack for Image, check for avtar
// upload them to cloudinary, avtar
// create user object - create entry in db
// remove the password and refresh token field from respose
// check for user creation
// return res or error

const {userName, email, fullName, password}  =req.body;
// console.log("email :", email)
// console.log("userName: ", userName)

if (
  [fullName, userName, email, password].some((field) => field?.trim() === "")
) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] })
  if(existedUser ){
    throw new ApiErrors(409, "User already exists")
  }
  //console.log("req.files: ", req.files)

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path; 
  }

  if(!avatarLocalPath) {
    throw new ApiErrors(400, "Avatar is required");
  }

  const avatar  = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiErrors(400, "Avatar file id required!");
  }
  const user  = await User.create(
    {fullName, avatar: avatar.url, coverImage: coverImage?.url || "", userName, email, password}
  )
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new ApiErrors(500, "ooh! something went wrong! while registering the User")
  }
  return res.status(201).json (
    new ApiResponse(200, createdUser, "User registered successfully!!")
  )
})

  // Login user
  // take the data from the req body
  // check if user is exist with the email and the username or Notification
  // if user exist than check it's password
  // access token and the refesh the token
  // // if user not exist than throw error

  const userLogin  = asyncshendelar(async (req, res)=>{

    const {email, userName, password} =  req.body;
    if(!email || !userName){
      throw new ApiErrors(400, "Email and Username are required!!")
    }

    const UserExist  = await User.findOne({
      $or: [{email}, {userName}]
    })
    if(!UserExist){
      throw new ApiErrors(404, "User not found with this email!!")
    }
    const isPasswordValid = await UserExist.isPasswordCorrect(password);
    if(!isPasswordValid){
      throw new ApiErrors(401, "Invalid password!!")
    }
    const { accessToken, refreshToken } = await generateRefreshToken(UserExist._id);

    const loggedInUser=  await User.findById(UserExist._id).select("-password -refreshToken");
    if(!loggedInUser){
      throw new ApiErrors(500, "Ooh! something went wrong while logging in the user")
    }
    const options = {
      httpOnly: true,
      secure : true
    }
    return res.status(200)
    .cookie(accessToken, accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully!!"));
  })

    const logutUser = asyncshendelar(async (req, res) => {

      
    })

export {registerUser, userLogin }




