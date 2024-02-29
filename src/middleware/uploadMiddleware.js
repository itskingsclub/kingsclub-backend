const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './upload',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        return cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extName) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and JPEG files are allowed.'));
    }
};


const fileSizeLimit = 2 * 1024 * 1024;
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: fileSizeLimit,
    },
});

// Middleware function for handling file uploads
const uploadMiddleware = (fields) => {
    return (req, res, next) => {
        upload.fields(fields)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred (e.g., file size exceeded)
                return res.status(400).json({
                    success: false,
                    message: 'File upload failed. ' + err.message,
                });
            } else if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed.',
                });
            }
            next();
        });
    };
};

module.exports = uploadMiddleware;