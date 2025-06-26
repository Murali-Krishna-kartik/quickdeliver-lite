const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/authMiddleware');


const {
  createDelivery,
  getAllDeliveries,
  getPendingDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  submitFeedback,
  getDeliveriesByStatus,
  sendDeliveryOtp,
  cancelDelivery
} = require('../controllers/deliveryController');
console.log('Route debug - submitFeedback:', typeof submitFeedback);
console.log('All imported functions:', {
  createDelivery: typeof createDelivery,
  submitFeedback: typeof submitFeedback
});
// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/deliveries'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'delivery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Delivery Routes
router.post('/', authenticate, upload.single('itemImage'), createDelivery);
router.get('/', authenticate, getAllDeliveries);
router.delete('/:id', authenticate, cancelDelivery); // Fixed this line

// Driver-specific routes
router.get('/pending', authenticate, getPendingDeliveries);
router.patch('/:id/accept', authenticate, acceptDelivery);
router.patch('/:id/status', authenticate, updateDeliveryStatus);
router.get('/status/:status', authenticate, getDeliveriesByStatus);
router.post('/:id/send-otp', authenticate, sendDeliveryOtp);

console.log('Route debug - submitFeedback:', typeof submitFeedback);
console.log('All imported functions:', {
  createDelivery: typeof createDelivery,
  submitFeedback: typeof submitFeedback
});

router.post(
  '/:id/feedback',
  authenticate,
  submitFeedback
);


// Error handling for file uploads
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }
  next(err);
});

module.exports = router;