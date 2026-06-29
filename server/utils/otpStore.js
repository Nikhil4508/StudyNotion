const otpStore = new Map();

function setOtp(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

function getOtp(email) {
  const entry = otpStore.get(email);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return null;
  }

  return entry.otp;
}

function clearOtp(email) {
  otpStore.delete(email);
}

module.exports = {
  setOtp,
  getOtp,
  clearOtp,
};
