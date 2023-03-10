import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { AbilityFactory } from './ability.factory/ability.factory';

@Module({
    providers: [AbilityFactory],
    exports: [AbilityFactory],
    imports: [
        
        forwardRef(() => AuthModule)
    ]
})
export class AbilityModule {}
