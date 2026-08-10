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
  }
}
