import Field from '@/emv/Field';
import MPM from '@/emv/MPM';
import MultiField from '@/emv/MultiField';
import InvalidPixCodeError from '@/errors/InvalidPixCodeError';
import DynamicPayload from '@/payloads/DynamicPayload';
import StaticPayload from '@/payloads/StaticPayload';
import { TOrUndefined, TPixCode, TReadableEMV } from '@/types';

export default class Reader {
	protected raw: string;
	protected mpm: MPM;

	constructor(pixCode: string) {
		this.raw = pixCode;
		this.mpm = new MPM();

		this.extract(pixCode);
	}

	public extract(pixCode: string) {
		if (!this.isValidCode(pixCode)) {
			throw new InvalidPixCodeError(pixCode);
		}

		this.raw = pixCode;
		this.mpm = new MPM();

		const pcode: TPixCode = { code: pixCode };

		while (pcode.code.length > 0) {
			this.extractor(pcode, this.mpm);
		}

		return this;
	}

	protected extractor(pcode: TPixCode, emvs: MPM | MultiField) {
		const curr_id = parseInt(this.getData(pcode, 2));
		const { value } = this.getEMV(curr_id, pcode);
		const emv =
			emvs instanceof MPM ? emvs.get(curr_id) : emvs.get(curr_id);

		if (emv === undefined) {
			return;
		}

		if (emv instanceof Field) {
			emv.applyValue(value);
			return;
		}

		if (emv instanceof MultiField) {
			const pixCode = { code: value };

			while (pixCode.code.length > 0) {
				this.extractor(pixCode, emv);
			}

			return;
		}
	}

	public getRaw(): string {
		return this.raw;
	}

	public getMPM(): MPM {
		return this.mpm;
	}

	public pixKey(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(26)?.get(1)?.getValue();
	}

	public description(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(26)?.get(2)?.getValue();
	}

	public url(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(26)?.get(25)?.getValue();
	}

	public amount(): TOrUndefined<number> {
		return parseFloat(this.mpm.get<Field>(54)?.getValue() ?? '0');
	}

	public merchantName(): TOrUndefined<string> {
		return this.mpm.get<Field>(59)?.getValue();
	}

	public merchantCity(): TOrUndefined<string> {
		return this.mpm.get<Field>(60)?.getValue();
	}

	public postalCode(): TOrUndefined<string> {
		return this.mpm.get<Field>(61)?.getValue();
	}

	public id(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(62)?.get(5)?.getValue();
	}

	public export(): StaticPayload | DynamicPayload {
		const mpm = this.mpm.copy();
		const poi = mpm.get(1)?.getValue();

		switch (poi) {
			case '11':
				return new StaticPayload().applyMPM(mpm);
			case '12':
				return new DynamicPayload().applyMPM(mpm);
		}

		const url = this.mpm.get<MultiField>(26)?.get<Field>(25)?.getValue();

		if (url) {
			return new DynamicPayload().applyMPM(mpm);
		}

		return new StaticPayload().applyMPM(mpm);
	}

	protected getEMV(id: number, pcode: TPixCode): TReadableEMV {
		const size = parseInt(this.getData(pcode, 2));

		return {
			id: id,
			size: size,
			value: this.getData(pcode, size),
		};
	}

	protected getData(pcode: TPixCode, size: number = 2): string {
		const extracted = pcode.code.substring(0, size);
		pcode.code = pcode.code.substring(size);
		return extracted;
	}

	protected isValidCode(pixCode: string) {
		return pixCode.indexOf('000201') !== -1;
	}
}
