import User from "../models/user.js";
export const managefcmtoken = async (req, res) => {

    try {
        console.log(req.body);
        
        const fcmToken  = req.body.token;
        console.log(fcmToken);
        console.log(req.user);
        
        
        const user = await User.findById(req.user.id);
        if(!user.fcmTokens){
            user.fcmTokens = [];
        }
        if(user.fcmTokens.includes(fcmToken)){
            return res.json({ message: "FCM token already exists" });
        }
        user.fcmTokens.push(fcmToken);
        await user.save();
        res.json({ message: "FCM token updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};