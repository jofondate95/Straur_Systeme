import { IsString, IsDecimal, IsInt, IsOptional } from 'class-validator';

export class CreateBusDto {
  @IsString()
  immatriculation: string;

  @IsString()
  ligneId: string;

  @IsOptional()
  @IsString()
  conducteurId?: string;

  @IsInt()
  capacitePassagers: number;
}

export class UpdateBusDto {
  @IsOptional()
  @IsString()
  conducteurId?: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsInt()
  capacitePassagers?: number;
}

export class UpdateBusLocationDto {
  @IsString()
  latitude: string;

  @IsString()
  longitude: string;
}

export class UpdateBusStatusDto {
  @IsString()
  statut: string;
}
