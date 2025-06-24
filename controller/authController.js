const bcrypt = require("bcrypt")
const crypto = require("crypto");
const Regis= require("../models/Regis");

const sendEmail = require("../utils/sendEmail")


 const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await Regis.findOne({ email });
    if (!user) {
        res.json({ message: "Email Does Not Exist!" })
    }

   const token = crypto.randomBytes(32).toString('hex'); 

    user.resetToken = token;
    user.tokenExpire = Date.now() + 3600000;


    await user.save();

    const link = `http://localhost:3000/reset/${token}`;
    await sendEmail(user.email, 'Reset Your Password', `<a href="${link}">Reset Password</a>`);

    res.json({ msg: "Reset Link SEnt your Email" })
}


const resetPassword =async(req,res)=>{
    const {token} = req.params;
    const {password }= req.body;

     const user = await Regis.findOne({
    resetToken: token,
    tokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(password,10);
  user.password=hashedPassword;
   user.resetToken = undefined;
  user.tokenExpire = undefined;
  await user.save();

  res.json({ msg: 'Password has been reset' });

}

module.exports = {
  forgotPassword,
  resetPassword,
};