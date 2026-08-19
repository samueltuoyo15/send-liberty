export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { connectToRedis } = await import('./lib/redis');
    const { connectDB } = await import('./lib/db');
    
    // Redis
    const client = connectToRedis();
    client.ping().then(() => {
      console.log('Redis eager connection established on server boot.');
    }).catch((err) => {
      console.error('Failed to eagerly connect to Redis on boot:', err.message);
    });

    // MongoDB
    connectDB().then(() => {
      console.log('MongoDB eager connection established on server boot.');
    }).catch((err) => {
      console.error('Failed to eagerly connect to MongoDB on boot:', err.message);
    });

    // Batch email worker, runs in a persistent background loop.
    // BRPOP blocks on the Redis queue; the loop never exits unless the process dies.
    const { startBatchWorker, startBatchResumer } = await import('./lib/batchWorker');
    startBatchWorker().then(() => {
      console.log('Batch worker started successfully.');
    }).catch((err) => {
      console.error('Batch worker crashed fatally:', err);
    });

    startBatchResumer();
    console.log('Batch resumer cron started successfully.');
  }
}
