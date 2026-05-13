import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateUserDto, UpdateWalletDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * GET /users
   * Liste tous les utilisateurs (ADMIN seulement)
   */
  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.usersService.getAllUsers(parseInt(skip as any), parseInt(take as any));
  }

  /**
   * GET /users/profile
   * Récupère le profil de l'utilisateur connecté
   */
  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@GetUser('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  /**
   * GET /users/:id
   * Récupère un utilisateur par son ID
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  /**
   * PUT /users/:id
   * Met à jour le profil utilisateur
   */
  @Put(':id')
  @UseGuards(JwtGuard)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * GET /users/:id/wallet
   * Récupère le solde du portefeuille
   */
  @Get(':id/wallet')
  @UseGuards(JwtGuard)
  async getWallet(@Param('id') id: string) {
    return this.usersService.getWalletBalance(id);
  }

  /**
   * POST /users/:id/wallet/topup
   * Recharge le portefeuille
   */
  @Post(':id/wallet/topup')
  @UseGuards(JwtGuard)
  async topUpWallet(@Param('id') id: string, @Body() { montant }: { montant: number }) {
    return this.usersService.topUpWallet(id, montant);
  }

  /**
   * GET /users/:id/fidelity-points
   * Récupère les points de fidélité
   */
  @Get(':id/fidelity-points')
  @UseGuards(JwtGuard)
  async getFidelityPoints(@Param('id') id: string) {
    return this.usersService.getFidelityPoints(id);
  }

  /**
   * GET /users/:id/transactions
   * Récupère l'historique des transactions
   */
  @Get(':id/transactions')
  @UseGuards(JwtGuard)
  async getTransactionHistory(
    @Param('id') id: string,
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ) {
    return this.usersService.getTransactionHistory(id, parseInt(skip as any), parseInt(take as any));
  }
}
