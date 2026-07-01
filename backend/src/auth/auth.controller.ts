import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterWithPasswordDto } from "./dto/register-with-password.dto";
import { LoginWithPasswordDto } from "./dto/login-with-password.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { minutes, seconds, Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
    async googleCallback(@Req() request: { user: { email?: string; nome?: string } }) {
        return this.authService.loginWithGoogle(request.user);
    }
}
