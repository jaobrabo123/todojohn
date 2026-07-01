import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomRequest } from "../entities/custom-request.entity";

export const CurrentUser = createParamDecorator(
    (data: keyof CustomRequest["user"], context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<CustomRequest>();

        return data ? request.user[data] : request.user;
    },
);
