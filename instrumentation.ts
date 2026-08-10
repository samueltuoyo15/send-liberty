export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getRedisClient } = await import('./lib/redis');
    const client = getRedisClient();
    
    client.ping().then(() => {
      console.log('Redis eager connection established on server boot.');
    }).catch((err) => {
      console.error('Failed to eagerly connect to Redis on boot:', err.message);
    });
  }
}
