import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signinDto';
import { demandeRestePasswordDto } from './dto/demandeRestePasswordDto';
import { ResetPasswordDto } from './dto/restePasswordDto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signin: SigninDto) {
    return this.authService.signin(signin);
  }

  @Post('reset-password')
  demandeResetPassword(
    @Body() demandeResetPasswordDto: demandeRestePasswordDto,
  ) {
    return this.authService.demandeRestePassword(demandeResetPasswordDto);
  }

  @Post('reste-password-confirmation')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordDto(resetPasswordDto);
  }
}
