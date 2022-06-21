import Field from '@/emv/Field';
import MPM from '@/emv/MPM';
import MultiField from '@/emv/MultiField';
import PixKeyTypeEnum from '@/enums/PixKeyTypeEnum';
import Parser from '@/pix/Parser';
import Validator from '@/pix/Validator';
import { TOrUndefined, TValueOf } from '@/types';
import { cleanString, random } from '@/utils';
import AbstractPayload from './AbstractPayload';

export default class StaticPayload extends AbstractPayload {
	constructor() {
		super();
		this.applyMPM(this.mpm);
	}

	public applyMPM(mpm: MPM) {
		// Pix Key is Required
		this.mpm.get<MultiField>(26)?.get<Field>(1)?.mandatory();
		// Remove Payment URL
		this.mpm.get<MultiField>(26)?.remove(25);
		// Set default Reference Label
		this.mpm.get<MultiField>(26)?.get<Field>(5)?.applyDefault('***');

		this.mpm = mpm;
		return this;
	}

	public pixKey(type: TValueOf<typeof PixKeyTypeEnum>, key: string) {
		Validator.validate(type, key);
		this.mpm
			.get<MultiField>(26)
			?.get<Field>(1)
			?.applyValue(Parser.parse(type, key));
		return this;
	}

	public description(description: string) {
		this.mpm
			.get<MultiField>(26)
			?.get<Field>(5)
			?.applyValue(cleanString(description).toUpperCase());

		return this;
	}

	public amount(amount: number) {
		this.mpm
			.get<MultiField>(26)
			?.get<Field>(5)
			?.applyValue(amount.toFixed(2));

		return this;
	}

	public tid(tid: TOrUndefined<string> = undefined) {
		if (tid === undefined) {
			tid = random();
		}

		this.mpm
			.get<MultiField>(62)
			?.get<Field>(5)
			?.applyValue(Parser.tid(tid));

		return this;
	}

	public getTid(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(62)?.get<Field>(5)?.getValue();
	}
}
