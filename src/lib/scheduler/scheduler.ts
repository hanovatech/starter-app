import type { ScheduledTask } from 'node-cron';

let initialized = false;
const tasks: ScheduledTask[] = [];

function stopAll() {
  for (const task of tasks) task.stop();
  tasks.length = 0;
}

/**
 * Starts the cron scheduler for all recurring jobs.
 * Add cron jobs here as the project grows.
 */
export function startScheduler() {
  if (initialized) return;
  initialized = true;

  // Example:
  // import cron from 'node-cron';
  // tasks.push(cron.schedule('0 3 1 * *', someJob));

  process.on('SIGINT', () => {
    stopAll();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    stopAll();
    process.exit(0);
  });
}
