import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterWithPasswordDto } from "./dto/register-with-password.dto";
import { LoginWithPasswordDto } from "./dto/login-with-password.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { minutes, seconds, Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Public()
    @Post("register")
    async registerWithPassword(@Body() dto: RegisterWithPasswordDto) {
        return this.authService.registerWithPassword(dto);
    }

    @Public()
    @Throttle({
        short: { limit: 1, ttl: seconds(1) },
        long: { limit: 10, ttl: minutes(5) },
    })
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async loginWithPassword(@Body() dto: LoginWithPasswordDto) {
        return this.authService.loginWithPassword(dto);
    }

    @Public()
    @Get("google")
    @UseGuards(GoogleAuthGuard)
    loginWithGoogle() {
        return;
    }

    @Public()
    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    async googleCallback(
        @Req() request: { user: { email?: string; nome?: string } },
        @Res() response: Response,
    ) {
        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:5173";

        try {
            const { accessToken } = await this.authService.loginWithGoogle(request.user);
            return response.redirect(
                `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(accessToken)}`,
            );
        } catch {
            return response.redirect(`${frontendUrl}/login?error=google`);
        }
    }
}
