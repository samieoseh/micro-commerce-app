// auth.controller.ts
import { Request, Response } from 'express';
import {authService} from './auth.service';

class AuthController {
  async signup(req: Request, res: Response) {
    const {email, password} = req.body;
    const result = await authService.signup({email, password, role: "user"});
  
    res.status(201).json({ success: true, data: result });
  }

  async signupAdmin(req: Request, res: Response) {
    const {email, password} = req.body;
    const result = await authService.signup({email, password, role: "admin"});
  
    res.status(201).json({ success: true, data: result });
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body;
    const result = await authService.login({email, password});
    
   
    res.status(200).json({ success: true, data: result});
  }

  async refresh(req: Request, res: Response) {
    const result = await authService.refresh(req.body.refreshToken)
    res.status(200).json({ success: true, data: result });
  }

  async forgotPassword(req: Request, res: Response) {
     await authService.forgotPassword(req.body.email)
    res.status(200).json({ success: true, message:"A reset link has been sent to the provided email address" });
  }

   async resetPassword(req: Request, res: Response) {
    const {token, newPassword} = req.body
     await authService.resetPassword({token, newPassword})
    res.status(200).json({ success: true, message:"Password reset successful" });
  }
}

export default new AuthController();
