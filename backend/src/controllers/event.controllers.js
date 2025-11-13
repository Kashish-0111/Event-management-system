import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Event } from "../models/event.model";
import { EventRegister } from "../models/eventregister.model.js";
import {User} from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllEvents = asyncHandler(async (req,res) => {
    const page= Number(req.query.page)||1;
    const limit = 10;
    const skip =(page-1)*limit;

    const events = (await Event.find().skip(skip).limit(limit)).toSorted({createdAt:-1});
    const totalEvents= await Event.countDocuments();

     if (!events || events.length === 0) {
    throw new ApiError( 404, "No events found");
  }

  return res.status(200).json(
  new ApiResponse(200, "Events fetched successfully", { total, page, events })
);

});

const getEventById= asyncHandler(async(req,res)=>{
    const event = await Event.findById(req.params.id);
     if (!event) throw new ApiError(404,"Event not found");
  return res.status(200).json(
    new ApiResponse(200, "Event fetched successfully", { event })
  );
})

const createEvent= asyncHandler(async (req,res) => {
   let imageUrl = "";
  if (req.file?.path) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult) {
      imageUrl = cloudinaryResult.secure_url;
    }
  }
     const event = await Event.create({
    ...req.body,
     imageUrl,
    createdBy: req.user._id
  });
    if(!event) throw new ApiError(500,"Unable to create event please try again later")
      
        return res.status(201).json(
        new ApiResponse(201,"Event created successfully ",{event}))
})

const updateEvent= asyncHandler(async(req,res)=>{
    const event = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

    if (!event) throw new ApiError(404,"Event not found");
    return res.status(200).json(
        new ApiResponse(200,"Event updated successfully",{event})
    )
});
const deleteEvent = asyncHandler(async (req,res)=>{
     const event = await Event.findByIdAndDelete(req.params.id)
     if (!event) throw new ApiError(404,"Event not found");
     return res.status(200).json(
        new ApiResponse(200,"Event deleted successfully")
     )
} )


const getEvents= asyncHandler(async(req,res)=>{
      const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
    const skip= (parseInt(page) - 1) * parseInt(limit);
     const events = await Event.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);
    return res.status(200).json(
      new ApiResponse(200, "Events Fetched Successfully",{
        events,
        totalEvents: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      })
    )
  
  })
  
  const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  //  Check if already registered
  const alreadyRegistered = await EventRegister.findOne({
    user: userId,
    event: eventId,
    status: "registered", // optional: ignore cancelled ones
  });

  if (alreadyRegistered) {
    return res.status(400).json(
      new ApiResponse(400, "Already Registered")
    );
  }

  //  Proceed with registration
  const registration = await EventRegister .create({
    user: userId,
    event: eventId,
  });

   //  Fetch event & user details
  const event = await Event.findById(eventId);
  const user = await User.findById(userId);

  //  Fire-and-forget email
  sendEmail({
    to: user.email,
    subject: `Registered for ${event.title}`,
    html: `<h2>Hi ${user.username},</h2><p>You have successfully registered for <strong>${event.title}</strong> on ${event.date.toDateString()}.</p>`
  });

  return res.status(201).json(
    new ApiResponse(201, "Event registration successful", registration)
  );
});

const getAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventRegister.find()
    .populate("user", "name email")
    .populate("event", "title date");

  return res.status(200).json(
    new ApiResponse(200, "All registrations fetched", registrations)
  );
});







 


    

    
export {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    registerForEvent,
    getAllRegistrations 

}
