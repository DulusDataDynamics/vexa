#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract';
import endContract from '../../snapshots/5704bfc97874a4df19277c714ec979da5624efedb3ccae8b74d356d3728e5aff/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'activity',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('metadata', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'agentRun',
        columns: [
          col('agentType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('conversationId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('prompt', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('result', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('startedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('QUEUED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'agentRun_agentType_check_2d10129b',
            "\"agentType\" IN ('CODER', 'DEBUGGER', 'PLANNER', 'REVIEWER', 'DEPLOYER')",
          ),
          checkExpression(
            'agentRun_status_check_be53ae1d',
            "\"status\" IN ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'codeChange',
        columns: [
          col('agentRunId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('changeType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('diff', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('filePath', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('summary', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'codeChange_changeType_check_8e1ff874',
            "\"changeType\" IN ('CREATE', 'UPDATE', 'DELETE', 'RENAME')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'conversation',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'deployment',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('deployedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('environment', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('QUEUED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'deployment_environment_check_5d7b88d1',
            "\"environment\" IN ('DEVELOPMENT', 'PREVIEW', 'PRODUCTION')",
          ),
          checkExpression(
            'deployment_status_check_0961b9cf',
            "\"status\" IN ('QUEUED', 'BUILDING', 'SUCCESS', 'FAILED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'message',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('conversationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'message_role_check_ca7958fc',
            "\"role\" IN ('USER', 'ASSISTANT', 'SYSTEM')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'project',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('repositoryUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('project_status_check_aef30f3b', "\"status\" IN ('ACTIVE', 'ARCHIVED')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'projectFile',
        columns: [
          col('content', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('language', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('path', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('size', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'projectMemory',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('value', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('avatarUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('username', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_1954e8c0', "\"role\" IN ('USER', 'ADMIN')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'projectFile',
        constraint: 'projectFile_projectId_path_key',
        columns: ['projectId', 'path'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'projectMemory',
        constraint: 'projectMemory_projectId_key_key',
        columns: ['projectId', 'key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_username_key',
        columns: ['username'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'activity',
        index: 'activity_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'activity',
        index: 'activity_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'agentRun',
        index: 'agentRun_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'agentRun',
        index: 'agentRun_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'codeChange',
        index: 'codeChange_agentRunId_idx_1f80425e',
        columns: ['agentRunId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'codeChange',
        index: 'codeChange_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'conversation',
        index: 'conversation_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'conversation',
        index: 'conversation_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'deployment',
        index: 'deployment_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'message',
        index: 'message_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project',
        index: 'project_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'projectFile',
        index: 'projectFile_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'projectMemory',
        index: 'projectMemory_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'activity',
        foreignKey: {
          name: 'activity_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'activity',
        foreignKey: {
          name: 'activity_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'agentRun',
        foreignKey: {
          name: 'agentRun_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'agentRun',
        foreignKey: {
          name: 'agentRun_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'conversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'codeChange',
        foreignKey: {
          name: 'codeChange_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'codeChange',
        foreignKey: {
          name: 'codeChange_agentRunId_fkey',
          columns: ['agentRunId'],
          references: { schema: 'public', table: 'agentRun', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversation',
        foreignKey: {
          name: 'conversation_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversation',
        foreignKey: {
          name: 'conversation_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'deployment',
        foreignKey: {
          name: 'deployment_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'message',
        foreignKey: {
          name: 'message_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'conversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'project',
        foreignKey: {
          name: 'project_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'projectFile',
        foreignKey: {
          name: 'projectFile_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'projectMemory',
        foreignKey: {
          name: 'projectMemory_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'project', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
