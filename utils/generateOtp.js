function generateOtp(digits = 4) {
    const randomNumbers = Date.now() * Math.random() * Math.random();
    return randomNumbers.toString().slice(0, digits);
  }
  
  module.exports = generateOtp;
  