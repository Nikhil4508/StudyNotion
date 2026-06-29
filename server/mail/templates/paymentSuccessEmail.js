exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Payment Successful</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: #FFD60A; padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #000; font-size: 24px; }
    .body { padding: 30px; color: #333; }
    .detail { background: #f9f9f9; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .detail p { margin: 6px 0; font-size: 14px; }
    .detail span { font-weight: bold; color: #000; }
    .footer { background-color: #161D29; padding: 20px; text-align: center; color: #aaa; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>StudyNotion</h1>
    </div>
    <div class="body">
      <h2>Payment Received ✅</h2>
      <p>Hi <strong>${name}</strong>, your payment was successful!</p>
      <div class="detail">
        <p>Amount Paid: <span>₹${amount}</span></p>
        <p>Order ID: <span>${orderId}</span></p>
        <p>Payment ID: <span>${paymentId}</span></p>
      </div>
      <p>Thank you for choosing StudyNotion. Your course access has been activated.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 StudyNotion. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};
