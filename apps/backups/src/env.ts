import { cleanEnv, str, num } from 'envalid';

const env = cleanEnv(process.env, {
	ADMIN_USER_ID: num({ default: 190349851 }),
	BACKUPS_BOT_TOKEN: str({ default: '' }),
	DB_HOST: str({ default: '' }),
	DB_PORT: str({ default: '' }),
	DB_NAME: str({ default: '' }),
	DB_USER: str({ default: '' }),
	DB_PWD: str({ default: '' }),

	RW_HOST: str({ default: '' }),
	RW_PORT: str({ default: '' }),
	RW_USER: str({ default: '' }),
	RW_PWD: str({ default: '' }),
	RW_NAME: str({ default: '' }),
});

export default env;
