const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure the email transport using Gmail, secure by using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,   // Fetch email from environment variables
    pass: functions.config().gmail.password // Fetch password from environment variables (App password)
  }
});

// Cloud Function triggered on order creation
exports.sendOrderEmail = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        
        // Fetch user data from Firestore
        const userRef = admin.firestore().collection('users').doc(orderData.userId);
        const userSnapshot = await userRef.get();
        
        // If user data is not available, return early
        if (!userSnapshot.exists) {
            console.log('User not found');
            return;
        }

        const userEmail = userSnapshot.data().email;

        // Define email content
        const mailOptions = {
            from: 'anuththarakawmini@gmail.com',   // Sender's email
            to: userEmail,                     // Recipient's email
            subject: 'Your Ordered Medicine Details',
            text: `
              This is your ordered medicine:

              Medicine Name: ${orderData.medicineName}
              Donor Name: ${orderData.donorName}
              Contact Number: ${orderData.contact}

              The donor has the medicine you wanted and would like to contact you to give the medicine.
            `,
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Order confirmation email sent to:', userEmail);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });


    
