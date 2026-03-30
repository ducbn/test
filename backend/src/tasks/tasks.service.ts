import {
  Injectable,
  NotFoundException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

const CACHE_KEY = 'tasks:all';
const CACHE_TTL = 60;

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async onModuleInit() {
    await this.redis.del(CACHE_KEY);
  }

  async findAll(): Promise<Task[]> {
    const cached = await this.redis.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as Task[];
    }
    const tasks = await this.taskRepo.find({ order: { createdAt: 'DESC' } });
    await this.redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(tasks));
    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task #${id} không tồn tại`);
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(dto);
    const saved = await this.taskRepo.save(task);
    await this.invalidateCache();
    return saved;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    const saved = await this.taskRepo.save(task);
    await this.invalidateCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
    await this.invalidateCache();
  }

  private async invalidateCache(): Promise<void> {
    await this.redis.del(CACHE_KEY);
  }
}
