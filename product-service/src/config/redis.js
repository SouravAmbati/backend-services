import {createClient} from 'redis';

const redisClient=createClient({
    url: process.env.REDIS_URL
})

redisClient.on('connect',()=>{
    console.log('connected to redis');
})

redisClient.on('error',(err)=>{
    console.error('Redis connection error: ',err);
})

await redisClient.connect();

export default redisClient