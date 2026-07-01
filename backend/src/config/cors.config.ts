import { ForbiddenException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        const isProduction = process.env.NODE_ENV === "production";

        if (!origin) return callback(null, true);

        if (
            (isProduction
                ? [process.env.FRONTEND_URL]
                : [
                      "http://localhost:5173",
                      "http://localhost:2923",
                      "http://localhost:3000",
                      "http://localhost:5500",
                  ]
            ).includes(origin ?? "")
        ) {
            callback(null, true);
        } else {
            callback(new ForbiddenException("Não permitido pelo CORS."));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204,
    credentials: true,
    maxAge: 86400,
};
