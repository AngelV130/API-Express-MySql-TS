import { cleanEnv, num, str } from 'envalid';
import * as dotenv from 'dotenv';

const env = cleanEnv(dotenv.config().parsed, {
    PORT: num({default:3000}),

    // conf DB MySql
    DB_HOST: str({default:"localhost"}),               
    DB_PORT: num({default:3306}),              
    DB_USER: str({default:"root"}),
    DB_PASSWORD: str({default:""}),
    DB_NAME: str({default:"default"}),

});

export default env;
