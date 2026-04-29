import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
	API_URL: str({ default: '' }),
	API_TOKEN: str({ default: '' }),
});

export default env;
