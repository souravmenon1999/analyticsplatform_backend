import mongoose from 'mongoose';
const { Schema } = mongoose;

const userList = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  googleID: String,
});

const userDb = mongoose.model('userList', userList);

export default userDb;
