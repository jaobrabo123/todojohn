import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTarefaDTO } from "./dto/create-tarefa.dto";
import { UpdateTarefaDTO } from "./dto/update-tarefa.dto";
import { RequestUser } from "../auth/entities/custom-request.entity";
import { TAREFA_REPOSITORY, type TarefaRepository } from "./tarefa.repository";
import { FindTarefaQueryDTO } from "./dto/find-tarefa-query.dto";

@Injectable()
export class TarefaService {
    constructor(@Inject(TAREFA_REPOSITORY) private readonly tarefaRepository: TarefaRepository) {}

    private assertTarefaExists<T>(tarefa: T): asserts tarefa is NonNullable<T> {
        if (!tarefa) throw new NotFoundException("Tarefa não encontrada.");
    }

    async create(dto: CreateTarefaDTO, user: RequestUser) {
        return this.tarefaRepository.save({
            ...dto,
            usuarioId: user.sub,
        });
    }

    async findAll(user: RequestUser, query: FindTarefaQueryDTO) {
        return this.tarefaRepository.findByUsuarioIdAndNomeContainsInsensitiveOptional(
            user.sub,
            query.nome,
        );
    }

    async findOne(id: string, user: RequestUser) {
        const tarefa = await this.tarefaRepository.findOneByIdAndUsuarioId(id, user.sub);
        this.assertTarefaExists(tarefa);
        return tarefa;
    }

    async update(id: string, dto: UpdateTarefaDTO, user: RequestUser) {
        const tarefa = await this.tarefaRepository.findOneByIdAndUsuarioId(id, user.sub);
        this.assertTarefaExists(tarefa);
        return this.tarefaRepository.patch(id, dto);
    }

    async remove(id: string, user: RequestUser) {
        const tarefa = await this.tarefaRepository.findOneByIdAndUsuarioId(id, user.sub);
        this.assertTarefaExists(tarefa);
        await this.tarefaRepository.remove(id);
    }
}
