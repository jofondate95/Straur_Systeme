import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLigneDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  couleur: string;
}

export class UpdateLigneDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  couleur?: string;
}

export class CreateArretDto {
  @IsString()
  nom: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  ligneId: string;
}

export class CreateHoraireDto {
  @IsString()
  ligneId: string;

  @IsString()
  heureDepart: string;

  @IsString()
  heureArrivee: string;

  @IsArray()
  joursActifs: string[];
}
