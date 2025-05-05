import express from "express";
import cloudinary from "cloudinary";
import Book from "../models/book.js";
import protectRoute from "../middleware/auth.js";


const router = express.Router();

//create a book
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    //upload  the image to cloudinary
    const uploadResponse = await cloudinary.UploadStream.upload(image);
    const imageUrl = uploadResponse.secure_url;
    //save the book to the database
    const book = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await book.save();
    res.status(201).json({ message: "Book created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//delete a book
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book=await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        //check if the user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }
        //delete image from cloudinary
        if(book.image && book.image.includes(cloudinary)){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.v2.uploader.destroy(publicId);
                //delete the book from the database
                await book.remove();
                res.status(200).json({ message: "Book deleted successfully" }); 
                
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);
            }

        }
        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    });

//update a book


//get all books
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username", "profileI  mage");
    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalbooks: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//get recommended books
router.get("/user",protectRoute, async (req, res) => {
    try {
        const books=await Book.find({user:req.user._id}).sort({createdAt:-1});
        res.json(books);

         
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
})


export default router;
