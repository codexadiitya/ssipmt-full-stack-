const cloudinary = require('../config/cloudinary.config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ssipmt-notes',
    resource_type: 'auto', // This allows PDFs, Docs, etc.
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
    public_id: (req, file) => {
        const name = file.originalname.split('.')[0];
        return `${Date.now()}-${name}`;
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
