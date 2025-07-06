import AuthModel from "../models/authSchema.js";

// Users Data
const getUserData =async(req, res) =>{

    try {

        const {id} = req.params;

        const UserData = await AuthModel.findById(id).select("-password");
        if(!UserData){
            return res.status(404).json({message:"User not found"});

    }
        return res.status(200).json({UserData});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"});

    }
}

const EditProfile = async (req, res) =>{
    try {
        const {id} = req.params;

        const {name, email, bio, skills, goal} = req.body;

        const user = await AuthModel.findById(id);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.skills = skills || user.skills;
        user.goal = goal || user.goal;

        await user.save();

        return res.status(200).json({message:"Profile Updated Successfully", user})

    }   catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

export {getUserData, EditProfile};