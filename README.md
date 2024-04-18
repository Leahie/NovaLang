# NovaLang
### Link to our documentation for the [MIT 2024 CRE[AT]E Challenge ]([url](https://docs.google.com/document/d/1ISRHYOTrsMIY67lTsfBSpmv2sFc6XUVt2Ec82_-jRlA/edit))
# Structure of This README
  1. [Running On Your Machine](#how-to-run-the-project)
  2. [How to Navigate the Folder Structure](#navigating-the-folder-structure)
  3. Machine Learning component
  4. Web Development component
  5. [Frameworks & Languages](#frameworks--languages)

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
This contains the user model for Mongo, a database. Databases like MySQL & Oracle hold data electronically in a computer system. We used this folder to connect the Node.js environment with MongoDB. The user-model currently contains the email, username, number of games played for easy and hard, and the user's accuracy. In the future, we hope to expand this to hold levels and badges. 

### Routes Folder 
Routes are a way to declutter the index.js file by grouping url routes based on topic. The folder contains the **user.js** route and the **game.js** route. The former includes the login, logout, and signup routes and the latter includes the different game modes and calls to the ML model. 

### Static Folder
This folder contains our CSS and 

### Views Folder


## Node JS

## EJS 
##


# Frameworks & Languages
## Node JS

## EJS 
## 
