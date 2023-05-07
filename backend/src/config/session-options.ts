import { RedisClientType } from 'redis';
import { SessionOptions } from 'express-session';
import RedisStore from 'connect-redis';

const getOptions = (redisClient: RedisClientType): SessionOptions => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      ttl: 15 * 60, // 15 minutes
      disableTouch: true,
      /* 
        ** Disables resetting the TTL when using touch **
        The express-session package uses touch
        to signal to the store that the user has interacted
        with the session but hasn't changed anything in its data.
        Typically, this helps keep the users session alive
        if session changes are infrequent but you may want to disable it
        to cut down the extra calls or to prevent users from keeping sessions open too long.
        Also consider enabling if you store a lot of data on the session.
      */
    }),
    cookie: { maxAge: 15 * 60 * 1000 /* 15 minutes */ },
  };
};

export default getOptions;
