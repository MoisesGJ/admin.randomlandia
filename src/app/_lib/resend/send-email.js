import "server-only";

import { Resend } from "resend";

export default async function SendEmail(to, subject, template) {
  const resend = new Resend(process.env.EMAIL_RESEND_API);

  const { data, error } = await resend.emails.send({
    from: `Randomlandia <${process.env.EMAIL_RESEND_FROM}>`,
    to,
    subject,
    html: template,
  });

  if (error) {
    console.log(error);
    throw new Error({ error: error.message });
  }

  return data;
}
