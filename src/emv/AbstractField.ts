import InvalidEmvFieldError from '@/errors/InvalidEmvFieldError';
import { TOrUndefined } from '@/types';

export default abstract class AbstractField {
	protected id: number;
	protected name: string;
	protected size: number;
	protected required: boolean;

	constructor(
		id: number,
		name: string,
		size: number = 99,
		required: boolean = false
	) {
		this.id = id;
		this.name = name;
		this.size = size;
		this.required = required;
	}

	public getId(): number {
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
			return `${this.id.toString().padStart(2, '0')}${v.padStart(
				2,
				'0'
			)}${v}`;
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
