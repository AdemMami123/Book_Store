import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Destination from "../models/destination.js";
import protectRoute from "../middleware/auth.js";


const router = express.Router();

//create a Destination
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    //upload  the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image); // Fix: Use uploader.upload
    const imageUrl = uploadResponse.secure_url;    //save the Destination to the database
    const newDestination = new Destination({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });    await newDestination.save();
    res.status(201).json({ message: "Destination created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//delete a Destination
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        //check if the user is the owner of the Destination
        if (destination.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this Destination" });
        }        //delete image from cloudinary
        if(destination.image && destination.image.includes('cloudinary')){
            try {
                const publicId = destination.image.split("/").pop().split(".")[0];
                await cloudinary.v2.uploader.destroy(publicId);
                //delete the Destination from the database
                await destination.deleteOne();
                res.status(200).json({ message: "Destination deleted successfully" }); 
                
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);        }

        } else {
            await destination.deleteOne();
            res.status(200).json({ message: "Destination deleted successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

//update a Destination


//get all Destinations
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const Destinations = await Destination.find()
      .sort({ createdAt: -1 })
      .skip(skip)      .limit(limit)
      .populate("user", "username profilePicture");
    const totalDestinations = await Destination.countDocuments();
    res.send({
      Destinations,
      currentPage: page,
      totalDestinations: Math.ceil(totalDestinations / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//get recommended Destinations
router.get("/user",protectRoute, async (req, res) => {
    try {
        const Destinations=await Destination.find({user:req.user._id}).sort({createdAt:-1});
        res.json(Destinations);

         
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
})


export default router;
