import { IsString, IsPhoneNumber, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  nom: string;

  @IsString()
  @MinLength(2)
  prenom: string;

  @IsPhoneNumber('CI')
  telephone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  motDePasse: string;
}

export class LoginDto {
  @IsPhoneNumber('CI')
  telephone: string;

  @IsString()
  motDePasse: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber('CI')
  telephone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
