import PixKeyTypeEnum from '@/enums/PixKeyTypeEnum';
import InvalidPixKeyTypeError from '@/errors/InvalidPixKeyTypeError';
import { TOrUndefined, TValueOf } from '@/types';

export default class Parser {
	public static alias(type: TValueOf<typeof PixKeyTypeEnum>): string {
		switch (type) {
			case PixKeyTypeEnum.RANDOM:
				return 'Chave Aleatória';
			case PixKeyTypeEnum.DOCUMENT:
				return 'CPF/CNPJ';
			case PixKeyTypeEnum.EMAIL:
				return 'E-mail';
			case PixKeyTypeEnum.PHONE:
				return 'Telefone';
		}

		throw new InvalidPixKeyTypeError(type);
	}

	public static parse(type: TValueOf<typeof PixKeyTypeEnum>, key: string) {
		switch (type) {
			case PixKeyTypeEnum.RANDOM:
				return key;
			case PixKeyTypeEnum.DOCUMENT:
				return Parser.document(key);
			case PixKeyTypeEnum.EMAIL:
				return Parser.email(key);
			case PixKeyTypeEnum.PHONE:
				return Parser.phone(key);
		}

		throw new InvalidPixKeyTypeError(type);
	}

	public static document(document: string): string {
		return document.replace(/[^\d]+/i, '');
	}

	public static email(
		email: string,
		replaceAtSymbol: boolean = false
	): string {
		return !replaceAtSymbol ? email : email.replace('@', ' ');
	}

	public static phone(phone: string): string {
		return '+55' + phone.replace('+55', '').replace(/[^\d]+/i, '');
	}

	public static tid(tid: TOrUndefined<string> = undefined): string {
		return tid === undefined || tid === '***'
			? '***'
			: tid.replace(/[^a-z0-9]+/i, '');
	}
}
