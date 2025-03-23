import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import * as path from 'path';

// to prevent undefined values in the seed.ts script
ConfigModule.forRoot({
  isGlobal: true,
});

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // autoLoadEntities: true,
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: false,
  logging: false,
  factories: ['src/seeding/factories/*.factory.ts'],
  seeds: ['src/seeding/main.seeder.ts'],
};

console.log('⏳ Start Seeding ...\n  ');

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);

  console.log('\n ✅ Seeding Completed.');
  process.exit();
});
