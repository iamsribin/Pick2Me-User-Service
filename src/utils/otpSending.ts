import {AuthService} from "./auth";
import generateOTP from "./generateOtp";
import { sendMail } from "./nodeMailer";

const auth = new AuthService();

export const sendOtp=async(email:string,name:string)=>{
    try {
        const otp = generateOTP();
        console.log("otp",otp);
        
        const token = await auth.createToken(otp,'2d',"Otp");        
        const subject = "Otp Verification";
        const text = `Hello ${name},\n\nThank you for registering with Retro-Routes!, your OTP is ${otp}\n\nHave a nice day!!!`;
        await sendMail(email, subject, text);
        console.log("otp, token",otp,token);
        return token
    } catch (error) {
        console.log("sendOtp fun",error);
    }
}