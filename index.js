const express = require("express")
const dotenv = require("dotenv")
const helmet = require("helmet")
dotenv.config();
const app = express();
app.use(helmet());
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const cors = require("cors");
const Regis = require("./models/Regis")
const Login = require("./models/Login")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "secretkey";
const { forgotPassword, resetPassword } = require('./controller/authController');


mongoose.connect("mongodb://localhost:27017/manage", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDb connected Successfully");

}).catch((err) => {
    console.log("Error Occured");
})

app.use(cors({
  origin: 'https://frontend-y3q9.vercel.app/',
  credentials: true
}));
app.use(express.json());
app.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Regis.findOne({ email: email });

        if (!user) {
            const User = await new Regis({ name, email, password: hashedPassword });
            await User.save();

            res.json({ message: "Account created Successfully!" })
        }
        else {
            res.json({ message: "User With this Email already Exists!!!" })
        }


    } catch (error) {
        console.log(error);
        res.json({ message: "Error saving Data" })

    }
})

app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await Regis.findOne({ email: email });
        console.log("Hello!");

        if (!user) {
         return   res.json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("hello1");
        
        if (!isMatch) {
           return res.json({ message: "Invalid Email or Password" })
        }
        const name= user.password;
         console.log("hello1");
        const token =  jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: "7d" });
           console.log("hello1");
       return res.json({ message: "Login Successfully",token,name});
    } catch (error) {
        console.log(error);
        
      return  res.json({ message: "Error in Logging In!!!" })
    }

})

app.post("/forgot",forgotPassword);
app.post("/reset/:token",resetPassword);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running at ${port}`);
})
