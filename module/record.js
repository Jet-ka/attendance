import mongoose from 'mongoose';
const recordSchema= new mongoose.Schema({
    month:String,
    name:String,
    cls:Number,
    attendance:Number,
    fees:String,
    amount:Number,
   
});
const record=mongoose.model('record',recordSchema);
export default record;