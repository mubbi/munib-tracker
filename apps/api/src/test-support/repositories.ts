import type { ObjectLiteral, Repository } from "typeorm";
import { type Mock, vi } from "vitest";

type RepositoryMethod =
  | "create"
  | "save"
  | "find"
  | "findOne"
  | "findBy"
  | "findOneBy"
  | "count"
  | "update"
  | "delete"
  | "insert"
  | "upsert"
  | "createQueryBuilder";

export type MockRepository = Record<RepositoryMethod, Mock>;

/**
 * TypeORM repository with every common method as a spy. `create` echoes its
 * input and `save` resolves it, so unit specs can inspect what was persisted.
 */
export function buildMockRepository(overrides: Partial<MockRepository> = {}): MockRepository {
  return {
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: unknown) => row),
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    findBy: vi.fn().mockResolvedValue([]),
    findOneBy: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    update: vi.fn().mockResolvedValue({ affected: 1 }),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
    insert: vi.fn().mockResolvedValue({ identifiers: [] }),
    upsert: vi.fn().mockResolvedValue({ identifiers: [] }),
    createQueryBuilder: vi.fn(),
    ...overrides,
  };
}

/** Casts a mock repository to the typed repository a service constructor expects. */
export function asRepository<T extends ObjectLiteral>(repo: MockRepository): Repository<T> {
  return repo as unknown as Repository<T>;
}
