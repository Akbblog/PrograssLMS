const Contact = require('../models/contact.model');
const nodemailer = require('nodemailer');

exports.createContact = async (req, res) => {
  try {
    const { fullName, name, email, phone, organization, role, subject, message } = req.body;

    // Support both 'name' and 'fullName' (frontend uses fullName)
    const contactName = fullName || name;

    if (!contactName || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and message are required' });
    }

    // 1. Save to Database
    const contact = new Contact({
      name: contactName,
      email,
      phone,
      organization,
      role,
      subject,
      message
    });
    await contact.save();

    // 2. Send Email via Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${contactName}" <${email}>`, // Sent "on behalf of" user
        to: process.env.GMAIL_USER, // Send TO the support email
        replyTo: email,
        subject: `LMS Inquiry: ${subject || 'New Contact Request'}`,
        html: `
          <h3>New Access/Contact Request</h3>
          <p><strong>Name:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
          <p><strong>Role:</strong> ${role || 'N/A'}</p>
          <hr/>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Contact email sent for ${email}`);
    } else {
      console.warn("⚠️ SMTP credentials missing (GMAIL_USER/GMAIL_PASS). Email skipped.");
    }

    return res.status(201).json({ status: 'success', data: contact, message: 'Request submitted successfully' });
  } catch (err) {
    console.error('Create contact error:', err);
    return res.status(500).json({ status: 'error', message: 'Server error processing request' });
  }
};
