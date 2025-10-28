import { DeepPartial, Repository } from "typeorm";
import { AppDataSource } from "../../config/sql-database";
import { ObjectLiteral } from "typeorm";
import { IBaseRepository } from "../interface/i-base-repo";
import { injectable } from "inversify";

@injectable()
export class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected repo: Repository<T>;

  constructor(entity: { new (): T }) {
    this.repo = AppDataSource.getRepository(entity);
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    try {
      return await this.repo.findOne({ where });
    } catch (error) {
      throw new Error( "Find one entity");
    }
  }

  async findAll(where: Partial<T> = {}): Promise<T[]> {
    try {
      return await this.repo.find({ where });
    } catch (error) {
      throw new Error( "Find all entities");
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repo.create(data);
      return await this.repo.save(entity);
    } catch (error) {
      throw new Error( "Create entity");
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      await this.repo.update(id, data);
      return await this.repo.findOne({ where: { id } as any });
    } catch (error) {
      throw new Error( "Update entity");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new Error( "Delete entity");
    }
  }

async findById(id: string): Promise<T | null> {
  try {
    return await this.repo.findOne({ where: { id } as any });
  } catch (error) {
    throw new Error( "Find entity by id");
  }
}
}
