import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
            clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.getOrThrow("GOOGLE_CALLBACK_URL"),
            scope: ["profile", "email"],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: {
            displayName?: string;
            emails?: Array<{ value?: string }>;
        },
    ) {
        return {
            email: profile.emails?.[0]?.value,
            nome: profile.displayName,
        };
    }
}
