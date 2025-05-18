import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus, Inject } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import createErrorResponse from '../../helpers/create-error-response.helper';
import { ErrorType } from '../../enums/error-type.enum';
import { I18nService } from 'nestjs-i18n';
import { extractFieldFromMessage } from './validation-exception-util';
import { I18nPath, I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import { ConfigType } from '@nestjs/config';
import i18nConfig from 'src/core/config/i18n.config';

@Catch(BadRequestException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly i18nConfiguration: ConfigType<typeof i18nConfig>,
  ) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const { acceptLanguageKey, fallbackLanguage } = this.i18nConfiguration;
    const fromHeader = request.headers[acceptLanguageKey] as string;
    const lang: string = fromHeader.split(',')[0] || fallbackLanguage;

    const error = this.buildErrorResponse(exception, lang, request.url);
    response.status(error.statusCode).json(error);
  }

  private buildErrorResponse(exception: BadRequestException, lang: string, path: string): ApiErrorResponse {
    const raw = exception.getResponse() as any;
    const status = HttpStatus.BAD_REQUEST;
    const messages = this.normalizeErrorItems(raw);

    const errors = messages.map((item) => this.formatErrorItem(item, lang));

    return createErrorResponse({
      statusCode: status,
      path,
      type: ErrorType.Validation,
      message: this.i18n.translate('validation.failed', { lang }),
      errors,
    });
  }

  private normalizeErrorItems(raw: any): any[] {
    if (typeof raw.message === 'string') return [raw.message];
    if (Array.isArray(raw.message)) return raw.message;
    if (Array.isArray(raw.errors)) return raw.errors;
    return [];
  }

  private formatErrorItem(item: any, lang: string) {
    /* ---------- plain string (e.g. "name must be a string") -------- */
    if (typeof item === 'string') {
      const { field, message } = extractFieldFromMessage(item);
      return {
        field,
        message: this.translateStringMessage(message, field, lang),
      };
    }

    /* ---------- class‑validator object with constraints ------------ */
    const field = item.property;
    const constraints = item.constraints ?? {};
    const firstKey = Object.keys(constraints)[0] as string;
    const template = constraints[firstKey] as string;

    return {
      field,
      message: this.translateConstraint(firstKey, template, field),
    };
  }

  private translateStringMessage(raw: string, field: string, lang: string): string {
    if (lang === this.i18nConfiguration.fallbackLanguage) {
      return raw;
    }

    if (raw.startsWith('validation.') || raw.startsWith('validation.')) {
      return this.i18n.translate(raw as keyof I18nTranslations, { lang, args: { property: field } });
    }

    const lower = raw.toLowerCase();
    const matchNumber = raw.match(/(\d+)/)?.[0];
    let key: I18nPath | null = null;

    // Boolean
    if (lower.includes('must be a boolean')) {
      return this.i18n.translate('validation.isBoolean', { lang, args: { property: field } });
    }

    // String
    if (lower.includes('must be a string')) {
      return this.i18n.translate('validation.isString', { lang, args: { property: field } });
    }

    // Not empty
    if (lower.includes('should not be empty')) {
      console.log(lower);
      return this.i18n.translate('validation.isNotEmpty', { args: { property: field } });
    }

    // Email
    if (lower.includes('must be an email')) {
      return this.i18n.translate('validation.isEmail', { lang, args: { property: field } });
    }

    // Number (integer)
    if (lower.includes('must be an integer')) {
      return this.i18n.translate('validation.isInt', { lang, args: { property: field } });
    }

    // Min value
    if (lower.includes('must not be less than') || lower.includes('must be greater than or equal to')) {
      return this.i18n.translate('validation.min', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // Max value
    if (lower.includes('must not be greater than') || lower.includes('must be less than or equal to')) {
      return this.i18n.translate('validation.max', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // Min length
    if (lower.includes('must be longer than') || lower.includes('must be at least')) {
      return this.i18n.translate('validation.minLength', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // Max length
    if (lower.includes('must be shorter than') || lower.includes('must be at most')) {
      return this.i18n.translate('validation.maxLength', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // IsPositive
    if (lower.includes('must be a positive number')) {
      return this.i18n.translate('validation.isPositive', { lang, args: { property: field } });
    }

    // Contains
    if (lower.includes('must contain a')) {
      return this.i18n.translate('validation.contains', {
        lang,
        args: { property: field, value: raw.match(/'([^']+)'/)?.[1] || 'value' },
      });
    }

    // IsEnum
    if (lower.includes('must be one of')) {
      return this.i18n.translate('validation.isEnum', { lang, args: { property: field } });
    }

    // IsNumber
    if (lower.includes('must be a number conforming to the specified constraints')) {
      return this.i18n.translate('validation.isNumber', { lang, args: { property: field } });
    }

    // ArrayUnique
    if (lower.includes('elements must be unique')) {
      return this.i18n.translate('validation.arrayUnique', { lang, args: { property: field } });
    }

    // IsIn
    if (lower.includes('must be one of the following values') || lower.includes('must be one of the following')) {
      return this.i18n.translate('validation.isIn', { lang, args: { property: field } });
    }

    // ArrayMinSize
    if (lower.includes('must contain at least')) {
      return this.i18n.translate('validation.arrayMinSize', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // ArrayMaxSize
    if (lower.includes('must contain not more than')) {
      return this.i18n.translate('validation.arrayMaxSize', {
        lang,
        args: { property: field, value: matchNumber },
      });
    }

    // UUID
    if (lower.includes('must be a uuid')) {
      return this.i18n.translate('validation.isUuid', { lang, args: { property: field } });
    }

    // Postal Code
    if (lower.includes('must be a postal code')) {
      return this.i18n.translate('validation.isPostalCode', { lang, args: { property: field } });
    }

    // Phone Number
    if (lower.includes('must be a valid phone number')) {
      return this.i18n.translate('validation.isPhoneNumber', { lang, args: { property: field } });
    }

    // MongoId
    if (lower.includes('must be a mongodb id')) {
      return this.i18n.translate('validation.isMongoId', { lang, args: { property: field } });
    }

    // Base32
    if (lower.includes('must be base32 encoded')) {
      return this.i18n.translate('validation.isBase32', { lang, args: { property: field } });
    }

    // Base64
    if (lower.includes('must be base64 encoded')) {
      return this.i18n.translate('validation.isBase64', { lang, args: { property: field } });
    }

    // Octal
    if (lower.includes('must be valid octal number')) {
      return this.i18n.translate('validation.isOctal', { lang, args: { property: field } });
    }

    // Magnet URI
    if (lower.includes('must be magnet uri format')) {
      return this.i18n.translate('validation.isMagnetUri', { lang, args: { property: field } });
    }

    // MAC Address
    if (lower.includes('must be a mac address')) {
      return this.i18n.translate('validation.isMacAddress', { lang, args: { property: field } });
    }

    // BTC Address
    if (lower.includes('must be a btc address')) {
      return this.i18n.translate('validation.isBtcAddress', { lang, args: { property: field } });
    }

    // Alphanumeric
    if (lower.includes('must contain only letters and numbers')) {
      return this.i18n.translate('validation.isAlphanumeric', { lang, args: { property: field } });
    }

    // Alpha only
    if (lower.includes('must contain only letters (a-z') || lower.includes('must contain only letters')) {
      return this.i18n.translate('validation.isAlpha', { lang, args: { property: field } });
    }

    // IsArray
    if (lower.includes('must be an array')) {
      return this.i18n.translate('validation.isArray', { lang, args: { property: field } });
    }

    // ArrayNotContains
    if (lower.includes('should not contain')) {
      return this.i18n.translate('validation.arrayNotContains', { lang, args: { property: field } });
    }

    // ArrayContains
    if (lower.includes('must contain')) {
      return this.i18n.translate('validation.arrayContains', { lang, args: { property: field } });
    }

    // IsFQDN
    if (lower.includes('must be a valid domain name')) {
      return this.i18n.translate('validation.isFqdn', { lang, args: { property: field } });
    }

    // IsUppercase
    if (lower.includes('must be uppercase')) {
      return this.i18n.translate('validation.isUppercase', { lang, args: { property: field } });
    }

    // IsLowercase
    if (lower.includes('must be a lowercase string')) {
      return this.i18n.translate('validation.isLowercase', { lang, args: { property: field } });
    }

    // IsJWT
    if (lower.includes('must be a jwt string')) {
      return this.i18n.translate('validation.isJwt', { lang, args: { property: field } });
    }

    // IsJSON
    if (lower.includes('must be a json string')) {
      return this.i18n.translate('validation.isJson', { lang, args: { property: field } });
    }

    // IsUrl
    if (lower.includes('must be a url address')) {
      return this.i18n.translate('validation.isUrl', { lang, args: { property: field } });
    }

    // IsDate
    if (lower.includes('must be a date instance')) {
      return this.i18n.translate('validation.isDate', { lang, args: { property: field } });
    }

    // IsAscii
    if (lower.includes('must contain only ascii characters')) {
      return this.i18n.translate('validation.isAscii', { lang, args: { property: field } });
    }

    // IsCreditCard
    if (lower.includes('must be a credit card')) {
      return this.i18n.translate('validation.isCreditCard', { lang, args: { property: field } });
    }

    // IsHexColor
    if (lower.includes('must be a hexadecimal color')) {
      return this.i18n.translate('validation.isHexColor', { lang, args: { property: field } });
    }

    // IsDataURI
    if (lower.includes('must be a data uri format')) {
      return this.i18n.translate('validation.isDataUri', { lang, args: { property: field } });
    }

    // IsIP
    if (lower.includes('must be an ip address')) {
      return this.i18n.translate('validation.isIp', { lang, args: { property: field } });
    }



    // Default fallback
    return raw;
  }

  private translateConstraint(field: string, constraint: string, lang: string): string | undefined {
    const keyMap: Record<string, string> = {
      isNotEmpty: 'validation.isNotEmpty',
      isString: 'validation.isString',
      isBoolean: 'validation.isBoolean',
      isInt: 'validation.isInt',
      isEmail: 'validation.isEmail',
      isIn: 'validation.isIn',
      isArray: 'validation.isArray',
      isOptional: 'validation.isOptional',
      arrayMinSize: 'validation.arrayMinSize',
      arrayMaxSize: 'validation.arrayMaxSize',
      min: 'validation.min',
      max: 'validation.max',
      length: 'validation.length',
      matches: 'validation.matches',
      isEnum: 'validation.isEnum',
      isDate: 'validation.isDate',
      isNumber: 'validation.isNumber',
      isUUID: 'validation.isUUID',
    };

    const i18nKey = keyMap[constraint];

    if (i18nKey) {
      return this.i18n.translate(i18nKey as keyof I18nTranslations, {
        lang,
        args: { property: field },
      });
    }

    return undefined;
  }
}
