import {
  ConflictException,
  Delete,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { demandeRestePasswordDto } from './dto/demandeRestePassword.dto';
import { ResetPasswordDto } from './dto/restePassword.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //INSCRIPTION
  async signup(SignupDto: SignupDto) {
    const { email, password, username } = SignupDto;

    // ** verifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) throw new ConflictException('This email is alrady exist!');
    // ** Hasher le mot de passe
    const hash = await argon.hash(password);

    // ** Enregistrer l' dans la base de données
    await this.prismaService.user.create({
      data: { email, username, password: hash },
    });
    // ** Envoyer un email de confirmation
    await this.mailerService.sendSignupConfirmation(email, username);
    // ** Retourner une reponse de succès
    return { Status: 201, message: 'User successfully created' };
  }

  // CONNEXION
  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    // **Verifier si l'utilisateur est dejà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new ForbiddenException('Email or password incorrect');

    // **Conparer les mots de passe
    const pws = await argon.verify(user.password, password);
    if (!pws) throw new ForbiddenException('Email or password incorrect');

    // **retouner un  token JTW
    const payload = {
      sub: user.email,
      email: user.email,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '10m',
      secret: this.configService.get('SECRET_KEY'),
    });

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  //DEMANDE RESET PASSWORD
  async demandeRestePassword(demandeRestePasswordDto: demandeRestePasswordDto) {
    const { email } = demandeRestePasswordDto;

    //** Trouver l'utilisateur dont on veut reste le mot de passe */
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user)
      throw new ForbiddenException('please provide an existing account ');

    //** creer un cle secret pour la confirmation de changement du mot de passe */
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });

    const url = 'http://localhost:3000/auth/reset-password-confirmation';

    //** Envoyer un Email de reinitialisation de reinitialisation de mot de passe */
    await this.mailerService.sendRestePasswordConfirmation(email, url, code);
    return { message: 'Reste Password email has benn sent!' };
  }

  //RESET PASSWORD
  async resetPasswordDto(resetPasswordDto: ResetPasswordDto) {
    const { email, code, password } = resetPasswordDto;

    //** Trouver l'utilisateur dont on veut reste le mot de passe */
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user)
      throw new ForbiddenException('please provide an existing account');

    //**on verifie si le code de confirmation est le meme */
    let match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
      token: code,
    });

    if (!match)
      throw new UnauthorizedException('This Token is invald or has expired!');

    //**On hash le nouveau mot de passe*/
    const hash = await argon.hash(password);

    //**On met a jour le mot de passe de l'utilisateur*/
    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });

    return {
      Satuts: 200,
      message: "User's password has been sucessfully updated!",
    };
  }

  //DELETE YOUR ACCOUNT
  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    //** Trouver l'utilisateur dont on veut reste le mot de passe */
    const user = await this.prismaService.user.findUnique({
      where: { userid: userId },
    });
    if (!user) throw new ForbiddenException('This user no longer exsist!');

    // **Conparer les mots de passe
    const pws = await argon.verify(user.password, deleteAccountDto.password);
    if (!pws) throw new ForbiddenException('password incorrect');

    //**delete a user Account */
    await this.prismaService.user.delete({ where: { userid: userId } });
    return {
      date: user,
      message: 'user was successfuly deleted',
    };
  }

  //UPDATE PASSWORD
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;

    //** Trouver l'utilisateur dont on veut reste le mot de passe */
    const user = await this.prismaService.user.findUnique({
      where: { userid: userId },
    });
    if (!user) throw new ForbiddenException('This user no longer exsist!');

    //**verification de l'ancien mot de pass */
    const pws = await argon.verify(user.password, password);
    if (!pws) throw new ForbiddenException('old password is incorrect');

    //**Hash le nouveau mot de passe */
    const hash = await argon.hash(newPassword);

    //**mise a jour du nouveau mot de passe*/
    await this.prismaService.user.update({
      where: { userid: userId },
      data: { password: hash },
    });
    Reflect.deleteProperty(user, 'password');
    return {
      data: user,
      message: 'Password successfully updated!',
    };
  }
}
