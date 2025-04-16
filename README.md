# 📦 Project Name

A brief description of what your Node.js app does.

## 🚀 Features

- Open Library API
- CRUD for RESTful API

## 🛠️ Tech Stack

- Node.js
- Express
- PostgreSQL
- Sequelize

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/vakyritsis/Book-Library.git

# Navigate into the project folder
cd Book-Library

# Install dependencies
npm install
```

## Database creation

```bash
# Create the database we have configured in db/config/database.json 

npx sequelize-cli db:create

# Do the migrations 
npx sequelize-cli db:migrate

```

Call the http://localhost:3000/initDb endpoint to init the db with data from Open Library API 

Afterwards we are ready to the Library and the CRUD operations with other APIs.

