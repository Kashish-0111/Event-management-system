import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Event } from "../models/event.model";

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
     const event = await Event.create({
    ...req.body,
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
    
export {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}
