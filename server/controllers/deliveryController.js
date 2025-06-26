const mongoose = require('mongoose');
const Delivery = require('../models/Delivery');
const nodemailer = require('nodemailer');

const sendFeedbackEmail = async (toEmail, customerName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or 'Mailgun', 'SendGrid', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"QuickDeliver" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'We hope your delivery went well!',
      html: `
        <p>Hi ${customerName},</p>
        <p>Your delivery has been marked as <strong>Completed</strong>.</p>
        <p>We’d love to hear your thoughts. Please take a moment to give us feedback.</p>
        <a href="https://yourdomain.com/feedback" style="padding:10px 15px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">Leave Feedback</a>
        <p>Thank you for using QuickDeliver!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Feedback email sent to ${toEmail}`);
  } catch (err) {
    console.error('Error sending feedback email:', err);
  }
};
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendOtpEmail = async (toEmail, customerName, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"QuickDeliver" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP for Delivery Confirmation',
    html: `
      <p>Hi ${customerName},</p>
      <p>Your OTP for confirming the delivery is:</p>
      <h2>${otpCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>Thank you for using QuickDeliver!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
exports.sendDeliveryOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate('createdBy', 'name email');

    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    delivery.otp = { code: otpCode, expiresAt };
    await delivery.save();

    await sendOtpEmail(delivery.createdBy.email, delivery.createdBy.name, otpCode);

    res.json({ success: true, message: 'OTP sent to customer' });
  } catch (err) {
    console.error('OTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, packageNote } = req.body;
    const itemImage = req.file?.filename;
    const createdBy = req.user._id;

    const newDelivery = new Delivery({
      pickupAddress,
      dropoffAddress,
      packageNote,
      status: 'Pending',
      createdBy,
      itemImage
    });

    await newDelivery.save();
    res.status(201).json({ 
      message: 'Delivery created successfully',
      delivery: newDelivery
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all deliveries for the current user
exports.getAllDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    const createdBy = new mongoose.Types.ObjectId(req.user._id);
    const query = { createdBy };

    if (status) {
      query.status = status;
    }

    const deliveries = await Delivery.find(query)
      .populate('createdBy', 'name email') 
      .populate('acceptedBy', 'name email') 
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (err) {
    console.error('Error fetching deliveries:', err);
    res.status(500).json({ 
      error: 'Server error fetching deliveries',
      details: err.message 
    });
  }
};

exports.getPendingDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: 'Pending' })
      .sort({ createdAt: -1 }) 
      .populate('createdBy', 'name email')
      .lean();

    res.json({ 
      success: true,
      deliveries 
    });
  } catch (err) {
    console.error('Error fetching pending deliveries:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch pending deliveries',
      details: err.message 
    });
  }
};

// Get deliveries by status (filtered by assigned driver for Accepted/In-Transit/Completed)
exports.getDeliveriesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.user._id;
    
    let query = { status };
    
    // For non-Pending statuses, only show deliveries accepted by current driver
    if (status !== 'Pending') {
      query.acceptedBy = userId;
    }
    
    const deliveries = await Delivery.find(query)
      .populate('createdBy', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      success: true,
      deliveries 
    });
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching deliveries',
      details: err.message 
    });
  }
};

// Cancel a delivery
exports.cancelDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Debug logging
    console.log(`Cancelling delivery ${id} for user ${req.user._id}`);
    
    const delivery = await Delivery.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (!delivery) {
      console.warn(`Delivery not found or not cancellable: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or cannot be cancelled'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery cancelled successfully',
      cancelledDelivery: delivery
    });
  } catch (err) {
    console.error('Cancellation error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during cancellation',
      error: err.message
    });
  }
};

// Add this to your controllers/deliveryController.js


// Accept a delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Delivery.findByIdAndUpdate(
      id,
      { 
        status: 'Accepted', 
        acceptedBy: req.user._id,
        acceptedAt: new Date() 
      },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('acceptedBy', 'name email');

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Delivery not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Delivery accepted', 
      delivery: updated 
    });
  } catch (err) {
    console.error('Error accepting delivery:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};


// Submit feedback for a completed delivery
exports.submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating (1-5)'
      });
    }

    // Find the delivery
    const delivery = await Delivery.findOne({
      _id: id,
      createdBy: userId,
      status: 'Completed'
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found or not eligible for feedback'
      });
    }

    // Check if feedback already exists
    if (delivery.feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this delivery'
      });
    }

    // Add feedback
    delivery.feedback = {
      rating,
      comment: comment || undefined, // Only set if comment exists
      createdAt: new Date()
    };

    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      delivery
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// Update delivery status

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, enteredOtp } = req.body;
    const userId = req.user._id;

    const delivery = await Delivery.findOne({
      _id: id,
      acceptedBy: userId
    }).populate('createdBy', 'name email');

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (newStatus === 'Completed') {
      // Check OTP
      if (!delivery.otp || delivery.otp.code !== enteredOtp || delivery.otp.expiresAt < new Date()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
    }

    const updateData = { status: newStatus };
    if (newStatus === 'Completed') updateData.completedAt = new Date();

    const updated = await Delivery.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'name email')
      .populate('acceptedBy', 'name email');

    // Clear OTP and send feedback mail
    if (newStatus === 'Completed') {
      delivery.otp = undefined;
      await delivery.save();
      await sendFeedbackEmail(delivery.createdBy.email, delivery.createdBy.name);
    }

    res.json({ success: true, message: 'Status updated successfully', delivery: updated });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
