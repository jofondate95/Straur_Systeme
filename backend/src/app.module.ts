import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LignesModule } from './modules/lignes/lignes.module';
import { BusModule } from './modules/buses/bus.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { QrCodeModule } from './modules/qrcode/qrcode.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FidelityModule } from './modules/fidelity/fidelity.module';
import { FavorisModule } from './modules/favoris/favoris.module';
import { PartageModule } from './modules/partage/partage.module';
import { StatsModule } from './modules/stats/stats.module';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketModule } from './gateway/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
    UsersModule,
    LignesModule,
    BusModule,
    ReservationsModule,
    QrCodeModule,
    PaymentModule,
    NotificationsModule,
    FidelityModule,
    FavorisModule,
    PartageModule,
    StatsModule,
    SocketModule,
  ],
  providers: [SocketGateway],
})
export class AppModule {}
