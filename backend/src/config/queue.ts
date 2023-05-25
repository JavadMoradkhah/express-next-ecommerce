import { Queue } from 'bullmq';

export const enum Queues {
  EMAIL = 'email',
}

export const queueConnection = {
  connection: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
};

export const emailQueue = new Queue(Queues.EMAIL, queueConnection);
