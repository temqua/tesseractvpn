import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
	API_URL: str({ default: '' }),
	API_TOKEN: str({ default: '' }),
	NEXT_PUBLIC_API_URL: str({ default: '' }),
});

export default env;
