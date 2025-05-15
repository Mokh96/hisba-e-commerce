import { registerAs } from '@nestjs/config';
import { I18nOptions } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';
import * as path from 'path';
import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';

export const I18N_CONFIG_KEY = 'i18n';

const i18nConfig = registerAs(
  I18N_CONFIG_KEY,
  (): Partial<I18nOptions> => ({
    fallbackLanguage: process.env.I18N_FALLBACK_LANG || 'en',
    loaderOptions: {
      path: path.resolve(process.cwd(), 'i18n'),
      watch: process.env.NODE_ENV !== 'production',
    },
    resolvers: [
      {
        use: QueryResolver,
        options: ['lang', 'locale'],
      },
      AcceptLanguageResolver,
    ],
    typesOutputPath: path.join(process.cwd(), 'src', 'startup', 'i18n', 'generated', 'i18n.generated.ts'),
  }),
);

export default i18nConfig;


/*I18nModuleLib.forRoot({
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
  typesOutputPath: path.join(process.cwd(), 'src', 'startup', 'i18n', 'generated', 'i18n.generated.ts'),
}),*/
