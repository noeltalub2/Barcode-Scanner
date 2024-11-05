import multer from 'multer';
import path from 'path';

const excelStorage = multer.diskStorage({
    // Destination to store file
    destination: 'public/document',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Use template literals for file naming
    },
});

const excelUpload = multer({
    storage: excelStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xlsx)$/)) {
            // Only allow .xlsx files
            req.fileValidationError = 'Please upload an Excel File. Try again';
            return cb(null, false, req.fileValidationError);
        }
        cb(null, true); // Accept the file
    },
});

export default excelUpload;
