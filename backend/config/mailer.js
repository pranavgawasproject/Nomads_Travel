import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"RoamIQ" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatFormData = (data) => {
  const entries = Object.entries(data ?? {}).filter(([, v]) => v !== undefined);

  const text = entries
    .map(([key, value]) => `${key}: ${value ?? ""}`)
    .join("\n");

  const htmlItems = entries
    .map(
      ([key, value]) =>
        `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value ?? "")}</li>`,
    )
    .join("");

  return {
    text,
    html: `<ul>${htmlItems}</ul>`,
  };
};

export const sendAdminFormNotification = async ({
  subject,
  formName,
  data,
}) => {
  const adminEmail = process.env.EMAIL_USER;
  if (!adminEmail) return;

  const { text, html } = formatFormData(data);
  const prefix = formName ? `[${formName}] ` : "";

  await sendMail({
    to: adminEmail,
    subject: `${prefix}${subject}`,
    text: `${formName ? `${formName}\n\n` : ""}${text}`,
    html: `
      <h2>${escapeHtml(subject)}</h2>
      ${formName ? `<p><strong>Form:</strong> ${escapeHtml(formName)}</p>` : ""}
      ${html}
    `,
  });
};
