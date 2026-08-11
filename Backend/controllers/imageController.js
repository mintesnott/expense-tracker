import { StatusCodes } from 'http-status-codes';

export const uploadImage = async (req, res) => {
  // Check if file was provided by Multer
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      msg: 'No image file uploaded' 
    });
  }

  // Generate URL for the uploaded file
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Return the image path to frontend/Postman
  res.status(StatusCodes.OK).json({ 
    msg: 'Image uploaded successfully', 
    imageUrl 
  });
};