import { Controller, Post } from '@nestjs/common';
import { Body, Delete, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { demandeRestePasswordDto } from './dto/demandeRestePassword.dto';
import { ResetPasswordDto } from './dto/restePassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  deleteAccount(
    @Req() request: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const userId = request.user['userid'];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('update-password')
  updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = request.user['userid'];
    return this.authService.updatePassword(userId, updatePasswordDto);
  }
}
