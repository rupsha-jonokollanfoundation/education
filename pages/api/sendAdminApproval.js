import nodemailer from "nodemailer";
import { firestore } from "firebase-admin";
import adminInit from "../../utils/firebaseAdmin";

// Must initialize firebase-admin (see below)
adminInit();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { studentId, studentEmail, studentName, classLevel } = req.body;

  // Set up transporter
  const transporter = nodemailer.createTransport({
    // Example SMTP, use your provider's credentials!
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL_ADDRESS,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    }
  });

  // Approve link (real URL in prod!)
  const approveUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin-approve?studentId=${studentId}`;

  const mailOptions = {
    from: `"Education Platform" <${process.env.ADMIN_EMAIL_ADDRESS}>`,
    to: "imranahmedimran8911@gmail.com",
    subject: "New Student Approval Needed",
    html: `
      <h3>New Student Registration</h3>
      <p>Name: ${studentName} <br>Email: ${studentEmail} <br>Class Level: ${classLevel}</p>
      <p><a href="${approveUrl}">Click here to approve student</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
