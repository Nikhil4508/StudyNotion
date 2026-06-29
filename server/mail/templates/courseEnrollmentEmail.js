exports.courseEnrollmentEmail = (courseName, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Course Enrollment Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: #FFD60A; padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #000; font-size: 24px; }
    .body { padding: 30px; color: #333; }
    .body h2 { color: #FFD60A; }
    .footer { background-color: #161D29; padding: 20px; text-align: center; color: #aaa; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>StudyNotion</h1>
    </div>
    <div class="body">
      <h2>Enrollment Confirmed 🎉</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>You have successfully enrolled in:</p>
      <h3 style="color:#FFD60A;">${courseName}</h3>
      <p>You can now access the course from your dashboard. Happy learning!</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 StudyNotion. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};
