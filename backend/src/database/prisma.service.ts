import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function convertDatesToWib(obj: Record<string, unknown>): void {
  for (const key in obj) {
    const value = obj[key];
    if (value instanceof Date) {
      obj[key] = new Date(value.getTime() + WIB_OFFSET_MS);
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      convertDatesToWib(value as Record<string, unknown>);
    }
  }
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  readonly db: PrismaClient;

  constructor(configService: ConfigService) {
    this.pool = new Pool({ connectionString: configService.getOrThrow('DATABASE_URL') });
    const adapter = new PrismaPg(this.pool);

    const client = new PrismaClient({ adapter }).$extends({
      query: {
        $allModels: {
          async create({ args, query }) {
            if (args.data) convertDatesToWib(args.data as Record<string, unknown>);
            return query(args);
          },
          async update({ args, query }) {
            if (args.data) convertDatesToWib(args.data as Record<string, unknown>);
            return query(args);
          },
          async upsert({ args, query }) {
            if (args.create) convertDatesToWib(args.create as Record<string, unknown>);
            if (args.update) convertDatesToWib(args.update as Record<string, unknown>);
            return query(args);
          },
        },
      },
    });

    this.db = client as unknown as PrismaClient;
  }

  async onModuleInit() {
    await this.db.$connect();
  }

  async onModuleDestroy() {
    await this.db.$disconnect();
    await this.pool.end();
  }
}
