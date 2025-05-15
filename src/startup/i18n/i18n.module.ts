import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule as I18nModuleLib, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModuleLib.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve(process.cwd(), 'i18n'),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang', 'locale'],
        },
        AcceptLanguageResolver,
      ],
      /* typesOutputPath: path.join(
         __dirname,
         '../../src/generated/i18n.generated',
       ),*/
      typesOutputPath: path.join(process.cwd(), 'src', 'startup', 'i18n', 'generated', 'i18n.generated.ts'),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [I18nModule],
})
export class I18nModule {}
