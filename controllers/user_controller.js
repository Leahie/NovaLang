const config = require('../config');
const nodemailer = require('nodemailer');

const User = require('../models/user.js');

const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
      },
});

exports.signup = async (req, res) => {
    console.log("I AM HERE")
    const{email, username, password} = req.body
    // Check we have an email
    // if (!email) {
    //    return res.status(422).send({ message: "Missing email." });
    // }
    // try{
    //    // Check if the email is in use
    //    const existingUser = await User.findOne({ email }).exec();
    //    if (existingUser) {
    //       return res.status(409).send({ 
    //             message: "Email is already in use."
    //       });
    //     }
       // Step 1 - Create and save the user
    //    const user = await new User({
    //       _id: new mongoose.Types.ObjectId,
    //       email: email
    //    }).save();

        const user = new User({email, verified:false, username});
        const registeredUser = await User.register(user, password);

       // Step 2 - Generate a verification token with the user's ID
       try {
            const verificationToken = registeredUser.generateVerificationToken();
            console.log(verificationToken)
            // Step 3 - Email the user a unique verification link
            const url = `http://localhost:3000/api/verify/${verificationToken}`
            transporter.sendMail({
                to: email,
                subject: 'Verify Account',
                html: `Click <a href = '${url}'>here</a> to confirm your email.`
            })
            return res.status(201).send({
                message: `Sent a verification email to ${email}`
       });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
       
   } 

exports.login = async (req, res) => {
    console.log("I AM HERE at LOGIN")
    // Check we have an email
    const { username, password } = req.body
    
    try{
        const user = await User.findOne({ username }).exec();
        if (!user) {
             return res.status(404).send({ 
                   message: "User does not exists" 
             });
        }
        // Step 2 - Ensure the account has been verified
        console.log(req.user)
        if(!req.user.verified){
            console.log("got here");
             return res.status(403).send({                     
                   message: "Verify your Account." 
             });
        }
        return res.status(200).send({
             message: "User logged in"
        });
     } 
     catch(err) {
        return res.status(500).send(err);
     }
}