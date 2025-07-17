import * as process from 'node:process'

export default () => ({
    database: {
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
    },
    app: {
        host: process.env.HOST,
        port: Number(process.env.PORT) || 4000,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  || '',
        region: process.env.AWS_REGION || '',
        endpoint: process.env.AWS_ENDPOINT || ''
    }
})