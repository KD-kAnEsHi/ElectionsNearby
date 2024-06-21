// require('dotenv').config();
// const express = require('express')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const User = require('./models/User')

// //set up the server
// const app = express()
// const PORT = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_SECRET

// const cors = require('cors');
// app.use(cors());



// app.set('view engine', 'ejs')

// //create routes
// //app.get
// //app.post
// //request, response, next
// // app.get('/', (req, res, next) =>{
// //     console.log('here')
// //     // res.status(500).json({message: "error"})
// //     //to download a file
// //     // res.download("server.js")
// //     // res.json({message: "error"})
// //     res.render("index", { text: "World"})
        
    
// // })


// //middleware
// app.use(bodyParser.json())
// //mongoDb connections
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Elections', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'MongoDB connection EROOR:'))
// db.once('open', ()=>{
//     console.log('CONNECTED SUCCESSFULLY TO MONGODB')
// })

// //schema for user collection
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     passwrod: { type: String, require: true },
//     email: { type: String, required: true, unique: true },
// })

// //user model based on the created schema
// // const User = mongoose.model('User', userSchema)

// // app.get('/', (req, res)=>{
// //     console.log("This is the server page")
// //     res.render('index', { text: 'world'})
// // })


// // const userRouter = require('./routes/users')
// // app.use('/users', userRouter)

// // //run our server
// // app.listen(PORT, ()=>{
// //     console.log(`The server is running on port ${PORT}`)
// // });

// // Route to handle user signup
// app.post('/api/signup', async (req, res) => {
//     const { username, password, email } = req.body;
  
//     try {
//       // Check if the user already exists
//       let existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Username already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create a new user instance
//       const newUser = new User({
//         username,
//         password: hashedPassword,
//         email,
//       });
  
//       // Save the user to the database
//       await newUser.save();
  
//       // Generate a JWT token for the newly registered user
//       const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
  
//       // Respond with token or any other response as needed
//       res.status(201).json({ message: 'User registered successfully', token });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
//   // Route to handle user login
//   app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       // Check if the user exists
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Verify the password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Create JWT token
//       const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  
//       // Respond with token
//       res.json({ token });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
//   // Start the server
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Set up the server
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set it in your environment variables.');
  process.exit(1);
}

const cors = require('cors');
app.use(cors());

// app.set('view engine', 'ejs');

// Middleware
app.use(express.json());

const mongoose = require('mongoose');


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Elections', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('CONNECTED SUCCESSFULLY TO MONGODB');
  }).catch((err) => {
    console.error('MongoDB connection ERROR:', err);
    process.exit(1);
  });
  console.log('Registered models:', Object.keys(mongoose.models));


// Basic route
app.get('/', (req, res) => {
  console.log("This is the server page");
  res.send('Welcome To Our Server :)')
//   res.render('index', { text: 'world' });
});


app.post('/api/signup', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      // Check if the user already exists
      let existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      });
  
      // Save the user to the database
      await newUser.save().then(savedUser => {
        console.log('User saved successfully:', savedUser)
      })
      .catch(err =>{
        console.log('Error saving user:', err)
        throw err
      });
  
      // Generate a JWT token for the newly registered user
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
  
      // Respond with token or any other response as needed
      res.status(201).json({ message: 'User registered successfully', token });
  
    } catch (error) {
      console.error('Error in signup route: ', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Respond with token
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});