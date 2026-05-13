import { IsString, IsEmail, IsDecimal, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateWalletDto {
  @IsDecimal()
  montant: number;

  @IsString()
  description: string;
}

export class CreateUserDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  telephone: string;

  @IsEmail()
  email: string;

  @IsString()
  motDePasse: string;

  @IsOptional()
  @IsString()
  role?: string;
}
