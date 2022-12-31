const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection Established');
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const deleteAll = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importAll = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importAll();
else if (process.argv[2] === '--delete') deleteAll();
