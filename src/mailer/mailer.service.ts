import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }

  async sendSignupConfirmation(userEmail: string, userName: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'INSCRIPTION A NOTRE APP',
      html: `<h3> Bienvenue sur notre application </h3> <br/> <p> Bonjour ${userName} nous vous souhaitons la bienvenue sur notre Api de test!</p>`,
    });
  }

  async sendRestePasswordConfirmation(
    userEmail: string,
    url: string,
    code: string,
  ) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'RESTE YOUR PASSWORD',
      html: `<h3>REINITIALISATION DU MOT DE PASSE </h3>
       <br/> <p>Bonjour Vous avez fait une demade de réintialisation de votre mot de passe copier le lien ci-dessous pour la reinitialisation <br/> 
       <a href="${url}"> Reset Password</a>  
       <br/> si vous n'avez pas fait de demande de réinitialisation veuillez igniorer ce message </p>
       <h3>${code}</h3>
       <p> ce code est valide pendant 15min</p>
       `,
    });
  }
}
