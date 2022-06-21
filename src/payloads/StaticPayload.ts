import Field from '@/emv/Field';
import MPM from '@/emv/MPM';
import MultiField from '@/emv/MultiField';
import { TOrUndefined } from '@/types';
import { cleanString } from '@/utils';
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

	public pixKey(type: string, key: string) {
		// TODO :: key parser
		this.mpm.get<MultiField>(26)?.get<Field>(1)?.applyValue(key);
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

	public tid(tid: string) {
		// TODO :: parse tid
		this.mpm.get<MultiField>(62)?.get<Field>(5)?.applyValue(tid);

		return this;
	}

	public getTid(): TOrUndefined<string> {
		return this.mpm.get<MultiField>(62)?.get<Field>(5)?.getValue();
	}
}
