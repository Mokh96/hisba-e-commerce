// import { IsString, Length, IsNumber } from 'class-validator';

// export class CreateUserDto {
//   @IsString()
//   @Length(2)
//   username: string;

//   @IsString()
//   password: string;

//   @IsNumber()
//   role: number;
// }

import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
