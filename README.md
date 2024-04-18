# NovaLang
### Link to our documentation for the [MIT 2024 CRE[AT]E Challenge ]([url](https://docs.google.com/document/d/1ISRHYOTrsMIY67lTsfBSpmv2sFc6XUVt2Ec82_-jRlA/edit))
# Structure of This README
  1. [Running On Your Machine](#how-to-run-the-project)
  2. [How to Navigate the Folder Structure](#navigating-the-folder-structure)
  3. [Web Development Component](#web-development-component)
  5. Summary

# How to Run the Project
  1. Clone the Repository
  2. Type npm install in the terminal to get node-modules
  3. Create the .env file, email us to receive the environmental variables
  4. Download [Mongodb]([url](https://www.mongodb.com/try/download/community))
  5. Run the server locally using "node index" 

# Navigating the Folder Structure
### ML Folder 
This folder contains all the files we used to fine-tune Gemini. We mainly used **model.py**, as it holds our training loop and our calls to Huggingface. The basic structure of natural language processing is having a tokenizer and a mode. Models don't understand words so the tokenizer converts the words into numbers. In **model.py** you can see we called the tokenizer and model for Gemma as well as the "shakespear" dataset. Our training loop consists of three epochs with batch sizes of 33. Unfortunately, this is smaller than what we hoped because of the immense time and size of Google's Gemini. To go through this training loop took 24+ hours and it filled our 5GB 4060 NVIDIA GPU immediately forcing the computer to reply on its CPU. The model details are uploaded on [Huggingface](https://huggingface.co/Liehe/GeminiShakespeare/tree/main/results), because of Github's storage space limit, it is not uploaded here. 

### Models Folder 
This contains the user model for MongoDB, a database. Databases like MySQL & Oracle hold data electronically in a computer system. We used this folder to connect the Node.js environment with MongoDB. The user-model currently contains the email, username, number of games played for easy and hard, and the user's accuracy. In the future, we hope to expand this to hold levels and badges. 

### Routes Folder 
Routes are a way to declutter the index.js file by grouping url routes based on topic. The folder contains the **user.js** route and the **game.js** route. The former includes the login, logout, and signup routes and the latter includes the different game modes and calls the ML model. 

### Static Folder
This folder contains our static CSS & Javascript models. A majority of the game's logic lies here. In particular, the **home.js** & **hard.js** files contain the logic for the easy and hard modes. 

### Views Folder
Our views folder holds the structure of the website. Each /get route corresponds with an EJS page. Inside the views folder, we split the structure into layout, pages, partials, and users. The **users** folder holds the pages for login, sign-in, and sign-out. The **pages** folder holds the games and profile. The rest of the elements follow in a similar manner. 

# Web Development Component 
## Frameworks & Languages
### Node JS + EJS 
Google describes Node.js as "a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine and executes JavaScript code outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting." EJS is a templating engine used by Node.JS; it functions similarly to HTML, however, you can pass backend components from your node.js server to your EJS file through objects. 

The reason we choose Node.js over other platforms like Next.JS or Flask is because Node.js is lightweight. Its backend is convenient and it has access to many frameworks like Express, and Passport, which we use in our app. Later, if we want to focus more on security, we might migrate to Rust. 

### Passport.JS
This is how we store user data. [Passport.JS](https://www.passportjs.org/)) uses Bcrypt, a hashing algorithm, to encode passwords and prevent security concerns. 
## Our Code 



