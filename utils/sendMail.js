const postmark = require("postmark")
const dotenv = require("dotenv")
const catchAsync = require("./catchAsync")
dotenv.config()
let postmarkKey = process.env.POSTMARK_KEY
let senderEmail = process.env.SENDER_EMAIL

var client = new postmark.ServerClient(postmarkKey);



function otpHtmlTemplate(otp) {
  return `
  <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
    <h2><span style="color='#fc6011';">Quiz</span></h2>
    <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; ">${otp}</h1>
   </div>
  `;
}

const sendMail = catchAsync(async (receipientEmail, otp) => {
  client.sendEmail({
    "From": senderEmail, 
    "To": receipientEmail, 
    "Subject": "Quiz Verification✅✅", 
    "TextBody": "Your OTP is ...",
    "HtmlBody": otpHtmlTemplate(otp)
  }, 
  function(error, result) {
    if(error) {
        console.error("Unable to send via postmark: " + error.message);
        return false;
    }
    console.info("Sent to postmark for delivery")
    return result
  });
})

module.exports.sendMail = sendMail;
