import { Worker } from 'bullmq';
import { transporter } from '../config/mail';
import { logger } from '../config/logger';
import { queueConnection } from '../config/queue';

const worker = new Worker(
  'emails',
  async (job) => {
    await transporter.sendMail({
      from: job.data.from,
      to: job.data.to,
      subject: job.data.subject,
      html: job.data.html,
    });
  },
  queueConnection
);

worker.on('completed', (job) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Job#${job.id} has completed!`);
  }
});

worker.on('failed', (job, err) => {
  logger.error(`Job#${job.id} has failed`, err);
});
