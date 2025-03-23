import { Client } from '../../modules/clients/entities/client.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
// @ts-expect-error
export const ClientFactory = setSeederFactory(Client, (faker: Faker) => {
  const client = new Client();
  // client.firstName = faker.person.firstName();
  // client.lastName = faker.person.lastName();
  client.email = faker.internet.email();
  client.phone = faker.phone.number({ style: 'international' });
  client.mobile = faker.phone.number({ style: 'international' });
  client.activity = faker.lorem.sentence();
  client.address = faker.location.streetAddress();
  client.agr = faker.lorem.sentence();
  client.ai = faker.lorem.sentence();
  client.birthDate = faker.date.birthdate();
  client.code = faker.lorem.word();
  client.fax = faker.phone.number({ style: 'international' });
  client.legalForm = faker.lorem.sentence();
  client.rc = faker.lorem.sentence();
  client.ref = faker.lorem.word();
  client.webPage = faker.internet.url();
  client.legalForm = faker.lorem.sentence();
  client.note = faker.lorem.sentence();

  return client;
});
