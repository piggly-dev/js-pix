import PixKeyTypeEnum from '@/enums/PixKeyTypeEnum';
import InvalidPixKeyTypeError from '@/errors/InvalidPixKeyTypeError';
import { TValueOf } from '@/types';
import Parser from './Parser';

export default class Validator {
	public static validate(
		type: TValueOf<typeof PixKeyTypeEnum>,
		value: string
	): boolean {
		switch (type) {
			case PixKeyTypeEnum.RANDOM:
				return Validator.random(value);
			case PixKeyTypeEnum.DOCUMENT:
				return Validator.document(value);
			case PixKeyTypeEnum.EMAIL:
				return Validator.email(value);
			case PixKeyTypeEnum.PHONE:
				return Validator.phone(value);
			default:
				throw new InvalidPixKeyTypeError(type);
		}

		return false;
	}

	public static random(random: string): boolean {
		return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
			random
		);
	}

	public static document(doc: string): boolean {
		doc = Parser.document(doc);

		switch (doc.length) {
			case 11:
				return Validator.cpf(doc);
			case 14:
				return Validator.cnpj(doc);
		}

		return false;
	}

	protected static cpf(doc: string): boolean {
		if (/^[\d]{11}$/.test(doc)) {
			return false;
		}

		let t = 0,
			c = 0,
			d = 0;

		for (t = 0; t < 11; t++) {
			for (d = 0, c = 0; c < t; c++) {
				d += parseInt(doc.charAt(c)) * (t + 1 - c);
			}

			d = ((10 * d) % 11) % 10;

			if (doc.charAt(c) !== d.toString()) {
				return false;
			}
		}

		return true;
	}

	protected static cnpj(doc: string): boolean {
		if (/^[\d]{14}$/.test(doc)) {
			return false;
		}

		let i = 0,
			j = 0,
			sum = 0,
			result = 0;

		for (i = 0, j = 5; i < 12; i++) {
			sum += parseInt(doc.charAt(i)) * j;
			j = j === 2 ? 9 : j - 1;
		}

		result = sum % 11;

		if (doc.charAt(12) !== (result < 2 ? 0 : 11 - result).toString()) {
			return false;
		}

		for (i = 0, j = 6; i < 12; i++) {
			sum += parseInt(doc.charAt(i)) * j;
			j = j === 2 ? 9 : j - 1;
		}

		result = sum % 11;

		return doc.charAt(13) === (result < 2 ? 0 : 11 - result).toString();
	}

	public static email(email: string): boolean {
		return /^.+@.+$/i.test(email);
	}

	public static phone(phone: string): boolean {
		return /^(\+55)?(\d{10,11})$/.test(Parser.phone(phone));
	}
}
