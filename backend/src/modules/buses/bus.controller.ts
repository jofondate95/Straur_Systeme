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
import { BusService } from './bus.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateBusDto, UpdateBusDto, UpdateBusLocationDto, UpdateBusStatusDto } from './dtos/bus.dto';

@Controller('buses')
export class BusController {
  constructor(private busService: BusService) {}

  /**
   * GET /buses
   * Récupère tous les bus (ADMIN seulement)
   */
  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllBuses() {
    return this.busService.getAllBuses();
  }

  /**
   * POST /buses
   * Crée un nouveau bus (ADMIN seulement)
   */
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async createBus(@Body() createBusDto: CreateBusDto) {
    return this.busService.createBus(createBusDto);
  }

  /**
   * GET /buses/ligne/:ligneId
   * Récupère les bus d'une ligne
   */
  @Get('ligne/:ligneId')
  async getBusesByLigne(@Param('ligneId') ligneId: string) {
    return this.busService.getBusesByLigne(ligneId);
  }

  /**
   * GET /buses/ligne/:ligneId/active
   * Récupère les bus actifs d'une ligne (pour mobile)
   */
  @Get('ligne/:ligneId/active')
  async getActiveBusesByLigne(@Param('ligneId') ligneId: string) {
    return this.busService.getActiveBusesByLigne(ligneId);
  }

  /**
   * GET /buses/:id
   * Récupère un bus par son ID
   */
  @Get(':id')
  async getBusById(@Param('id') id: string) {
    return this.busService.getBusById(id);
  }

  /**
   * GET /buses/:id/location
   * Récupère la localisation GPS d'un bus
   */
  @Get(':id/location')
  async getBusLocation(@Param('id') id: string) {
    return this.busService.getBusLocation(id);
  }

  /**
   * PUT /buses/:id
   * Met à jour un bus (ADMIN seulement)
   */
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async updateBus(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busService.updateBus(id, updateBusDto);
  }

  /**
   * PUT /buses/:id/location
   * Met à jour la localisation GPS (CONDUCTEUR)
   */
  @Put(':id/location')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CONDUCTEUR')
  async updateBusLocation(@Param('id') id: string, @Body() { latitude, longitude }: any) {
    return this.busService.updateBusLocation(id, parseFloat(latitude), parseFloat(longitude));
  }

  /**
   * PUT /buses/:id/status
   * Met à jour le statut d'un bus
   */
  @Put(':id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'CONDUCTEUR')
  async updateBusStatus(@Param('id') id: string, @Body() { statut }: UpdateBusStatusDto) {
    return this.busService.updateBusStatus(id, statut);
  }

  /**
   * POST /buses/:id/assign-conductor
   * Affecte un conducteur à un bus (ADMIN seulement)
   */
  @Post(':id/assign-conductor')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async assignConductor(@Param('id') id: string, @Body() { conducteurId }: any) {
    return this.busService.assignConductorToBus(id, conducteurId);
  }

  /**
   * POST /buses/:id/remove-conductor
   * Retire un conducteur d'un bus (ADMIN seulement)
   */
  @Post(':id/remove-conductor')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async removeConductor(@Param('id') id: string) {
    return this.busService.removeConductorFromBus(id);
  }

  /**
   * DELETE /buses/:id
   * Supprime un bus (ADMIN seulement)
   */
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteBus(@Param('id') id: string) {
    return this.busService.deleteBus(id);
  }
}
