import { TEMVAvailableFields, TOrUndefined } from '@/types';
import { CRC16 } from '@/utils';
import AbstractField from './AbstractField';
import Field from './Field';
import MultiField from './MultiField';

export default class MPM {
	protected emvs: Array<AbstractField>;
	protected codeCache: TOrUndefined<string>;

	constructor() {
		this.emvs = [
			new Field(0, 'Payload Format Indicator', 2, true, '01'),
			new Field(1, 'Point of Initiation Method', 2, false, '11'),
			new MultiField(
				26,
				0,
				99,
				'Merchant Account Information',
				99,
				true
			),
			new Field(52, 'Merchant Category Code', 4, true, '0000'),
			new Field(53, 'Transaction Currency', 3, true, '986'),
			new Field(54, 'Transaction Amount', 13, false),
			new Field(58, 'Country Code', 2, true, 'BR'),
			new Field(59, 'Merchant Name', 25, true),
			new Field(60, 'Merchant City', 15, true),
			new Field(61, 'Postal Code', 10, false),
			new MultiField(
				62,
				0,
				99,
				'Additional Data Field Template',
				99,
				true
			),
		];

		(this.get<MultiField>(26) as MultiField)
			.add(
				new Field(
					0,
					'Globally Unique Identifier',
					32,
					true,
					'br.gov.bcb.pix'
				)
			)
			.add(new Field(1, 'Pix Key', 36, false))
			.add(new Field(2, 'Payment Description', 40, false))
			.add(new Field(25, 'Payment URL', 77, false));

		(this.get<MultiField>(62) as MultiField).add(
			new Field(5, 'Reference Label', 25, false)
		);
	}

	public get<F = TEMVAvailableFields>(id: number): TOrUndefined<F> {
		return this.emvs.find(v => v.getId() === id) as F;
	}

	public remove(id: number): MPM {
		this.cleanCache();

		this.emvs = this.emvs.filter(v => v.getId() !== id);
		return this;
	}

	public has(id: number): boolean {
		return this.emvs.find(v => v.getId() === id) !== undefined;
	}

	public cleanCache(): MPM {
		this.codeCache = undefined;
		return this;
	}

	public copy(): MPM {
		const mpm = new MPM();

		mpm.emvs = [...this.emvs];
		return mpm;
	}

	public export(): string {
		if (this.codeCache) {
			return this.codeCache;
		}

		this.emvs.sort((a, b) => a.getId() - b.getId());
		const code = this.emvs.map(v => v.export()).join('') + '6304';

		this.codeCache = code + CRC16(code);
		return this.codeCache;
	}
}
