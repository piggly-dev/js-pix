import InvalidEmvFieldError from '@/errors/InvalidEmvFieldError';
import { TOrUndefined } from '@/types';

export abstract class AbstractField {
	protected id: string;
	protected name: string;
	protected size: number;
	protected required = false;

	constructor(id: string, name: string, size: number) {
		this.id = id;
		this.name = name;
		this.size = size;
	}

	public getId(): string {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getSize(): number {
		return this.size;
	}

	public isRequired(): boolean {
		return this.required;
	}

	public export(): string {
		const v = this.getValue();

		if (v) {
			return `${this.id}${v.padStart(2, '0')}${v}`;
		}

		if (this.required) {
			throw new InvalidEmvFieldError(
				this.name,
				'undefined',
				'O campo é obrigatório'
			);
		}

		return '';
	}

	public abstract getValue(): TOrUndefined<string>;
}
