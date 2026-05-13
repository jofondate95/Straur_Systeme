import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LignesService } from './lignes.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateLigneDto, UpdateLigneDto, CreateArretDto, CreateHoraireDto } from './dtos/ligne.dto';

@Controller('lignes')
export class LignesController {
  constructor(private lignesService: LignesService) {}

  /**
   * GET /lignes
   * Récupère toutes les lignes
   */
  @Get()
  async getAllLignes() {
    return this.lignesService.getAllLignes();
  }

  /**
   * GET /lignes/active
   * Récupère les lignes actives (pour mobile)
   */
  @Get('active/list')
  async getActiveLignes() {
    return this.lignesService.getActiveLignes();
  }

  /**
   * POST /lignes
   * Crée une nouvelle ligne (ADMIN seulement)
   */
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async createLigne(@Body() createLigneDto: CreateLigneDto) {
    return this.lignesService.createLigne(createLigneDto);
  }

  /**
   * GET /lignes/:id
   * Récupère une ligne par son ID
   */
  @Get(':id')
  async getLigneById(@Param('id') id: string) {
    return this.lignesService.getLigneById(id);
  }

  /**
   * PUT /lignes/:id
   * Met à jour une ligne (ADMIN seulement)
   */
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async updateLigne(@Param('id') id: string, @Body() updateLigneDto: UpdateLigneDto) {
    return this.lignesService.updateLigne(id, updateLigneDto);
  }

  /**
   * DELETE /lignes/:id
   * Supprime une ligne (ADMIN seulement)
   */
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteLigne(@Param('id') id: string) {
    return this.lignesService.deleteLigne(id);
  }

  /**
   * GET /lignes/:id/arrets
   * Récupère les arrêts d'une ligne
   */
  @Get(':id/arrets')
  async getArrets(@Param('id') ligneId: string) {
    return this.lignesService.getArretsByLigne(ligneId);
  }

  /**
   * POST /lignes/:id/arrets
   * Crée un arrêt pour une ligne (ADMIN seulement)
   */
  @Post(':id/arrets')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async createArret(@Param('id') ligneId: string, @Body() createArretDto: CreateArretDto) {
    return this.lignesService.createArret({
      ...createArretDto,
      ligneId,
    });
  }

  /**
   * DELETE /lignes/arrets/:arretId
   * Supprime un arrêt (ADMIN seulement)
   */
  @Delete('arrets/:arretId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteArret(@Param('arretId') arretId: string) {
    return this.lignesService.deleteArret(arretId);
  }

  /**
   * GET /lignes/:id/horaires
   * Récupère les horaires d'une ligne
   */
  @Get(':id/horaires')
  async getHoraires(@Param('id') ligneId: string) {
    return this.lignesService.getHorairesByLigne(ligneId);
  }

  /**
   * POST /lignes/:id/horaires
   * Crée un horaire pour une ligne (ADMIN seulement)
   */
  @Post(':id/horaires')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async createHoraire(@Param('id') ligneId: string, @Body() createHoraireDto: CreateHoraireDto) {
    return this.lignesService.createHoraire({
      ...createHoraireDto,
      ligneId,
    });
  }

  /**
   * DELETE /lignes/horaires/:horaireId
   * Supprime un horaire (ADMIN seulement)
   */
  @Delete('horaires/:horaireId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteHoraire(@Param('horaireId') horaireId: string) {
    return this.lignesService.deleteHoraire(horaireId);
  }
}
