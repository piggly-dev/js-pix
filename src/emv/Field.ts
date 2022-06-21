import InvalidEmvFieldError from '@/errors/InvalidEmvFieldError';
import { TOrUndefined } from '@/types';
import AbstractField from './AbstractField';

export default class Field extends AbstractField {
	protected value: TOrUndefined<string>;
	protected defValue: TOrUndefined<string>;

	constructor(
		id: number,
		name: string,
		size: number = 99,
		required: boolean = false,
		defValue: TOrUndefined<string> = undefined
	) {
		super(id, name, size, required);
		this.defValue = defValue;
	}

	public applyValue(value: string, substring: boolean = true) {
		if (value.length > this.size) {
			if (substring) {
				value = value.substring(0, this.size);
			} else {
				throw new InvalidEmvFieldError(
					this.name,
					value,
					`Excede o limite de "${this.size}" caracteres`
				);
			}
		}

		this.value = value;
		return this;
	}

	public applyDefault(value: string) {
		this.defValue = value;
		return this;
	}

	public getDefaultValue(): TOrUndefined<string> {
		return this.defValue;
	}

	public getValue(): TOrUndefined<string> {
		return this.value ?? this.defValue ?? undefined;
	}
}
