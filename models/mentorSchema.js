import mongoose from "mongoose"; 

const authSchema = new mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true, unique:true},
    available:{type:String, require:true,
        enum: ["NOT-AVAILABLE", "AVAILABLE", "PENDING"],
        default:"AVAILABLE"
    },
    bio:{type:String, default:""},
    topic:{type:String},
    goal:{type:String},
},
    {timestamps:true},
    {minimize: false},
)

const MentorModel = mongoose.model.mentor || mongoose.model("Mentor", authSchema);
export default MentorModel;