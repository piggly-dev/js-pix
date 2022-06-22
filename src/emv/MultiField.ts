import InvalidEmvFieldError from '@/errors/InvalidEmvFieldError';
import { TEMVAvailableFields, TOrUndefined } from '@/types';
import AbstractField from './AbstractField';

export default class MultiField extends AbstractField {
	public readonly minid: number;
	public readonly maxid: number;

	protected fields: Array<AbstractField> = [];

	constructor(
		id: number,
		minid: number,
		maxid: number,
		name: string,
		size: number = 99,
		required: boolean = false
	) {
		super(id, name, size, required);

		this.minid = minid;
		this.maxid = maxid;
	}

	public getValue(): TOrUndefined<string> {
		if (this.fields.length === 0) {
			return '';
		}

		return this.fields.map(v => v.export()).join('');
	}

	public add(field: AbstractField): MultiField {
		if (this.has(field.getId())) {
			throw new InvalidEmvFieldError(
				field.getName(),
				field.getId().toString(),
				`O ID do campo já existe no campo pai "${this.name}"`
			);
		}

		const id = field.getId();

		if (id < this.minid || id > this.maxid) {
			throw new InvalidEmvFieldError(
				field.getName(),
				field.getId().toString(),
				`O ID do campo não está dentro do limite de "${this.minid}" até "${this.maxid}" aceito pelo campo pai "${this.name}"`
			);
		}

		this.fields.push(field);
		return this;
	}

	public remove(id: number): MultiField {
		this.fields = this.fields.filter(v => v.getId() !== id);
		return this;
	}

	public get<F = TEMVAvailableFields>(id: number): TOrUndefined<F> {
		return this.fields.find(v => v.getId() === id) as TOrUndefined<F>;
	}

	public has(id: number): boolean {
		return this.fields.find(v => v.getId() === id) !== undefined;
	}
}
