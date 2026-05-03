import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vedantkatharotiya523@gmail.com",
    pass: "qmsgtutbvazivusr",
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"My App" <vedantkatharotiya523@gmail.com>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};
