import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    Put,
} from "@nestjs/common";
import { TarefaService } from "./tarefa.service";
import { CreateTarefaDTO } from "./dto/create-tarefa.dto";
import { UpdateTarefaDTO } from "./dto/update-tarefa.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { RequestUser } from "../auth/entities/custom-request.entity";
import { FindTarefaQueryDTO } from "./dto/find-tarefa-query.dto";

@Controller("tarefas")
export class TarefaController {
    constructor(private readonly tarefaService: TarefaService) {}

    @Post()
    create(@Body() dto: CreateTarefaDTO, @CurrentUser() user: RequestUser) {
        return this.tarefaService.create(dto, user);
    }

    @Get()
    findAll(@CurrentUser() user: RequestUser, @Query() query: FindTarefaQueryDTO) {
        return this.tarefaService.findAll(user, query);
    }

    @Get(":id")
    findOne(@Param("id") id: string, @CurrentUser() user: RequestUser) {
        return this.tarefaService.findOne(id, user);
    }

    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() dto: UpdateTarefaDTO,
        @CurrentUser() user: RequestUser,
    ) {
        return this.tarefaService.update(id, dto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param("id") id: string, @CurrentUser() user: RequestUser) {
        await this.tarefaService.remove(id, user);
    }
}
