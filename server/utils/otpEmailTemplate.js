function getOtpEmailTemplate(otp) {
  const otpText = String(otp ?? "");

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f6f8fb; padding: 24px;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb;">
        <div style="background: #111827; padding: 28px 32px; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; line-height: 1.2;">StudyNotion verification code</h1>
          <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 14px;">Use the code below to complete your signup.</p>
        </div>

        <div style="padding: 32px; color: #111827;">
          <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">Your one-time password is:</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 18px 0 20px;">
            <tr>
              <td style="padding: 18px 20px; background: #fef3c7; border: 1px solid #fbbf24; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111827; text-align: center;">
                ${otpText}
              </td>
            </tr>
          </table>

          <p style="margin: 0 0 8px; font-size: 14px; color: #4b5563;">OTP: <strong style="color: #111827;">${otpText}</strong></p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #4b5563;">This code expires in 5 minutes.</p>
          <p style="margin: 0; font-size: 14px; color: #4b5563;">If you did not request this email, you can safely ignore it.</p>
        </div>

        <div style="padding: 18px 32px 28px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">StudyNotion Security Team</p>
        </div>
      </div>
    </div>
  `;
}

module.exports = getOtpEmailTemplate;
