import Field from '@/emv/Field';
import MPM from '@/emv/MPM';
import MultiField from '@/emv/MultiField';
import InvalidEmvFieldError from '@/errors/InvalidEmvFieldError';
import AbstractPayload from './AbstractPayload';

export default class DynamicPayload extends AbstractPayload {
	constructor() {
		super();
		this.applyMPM(this.mpm);
	}

	public applyMPM(mpm: MPM) {
		// Change point of initiation method
		this.mpm.get<Field>(1)?.applyValue('12');
		// Remove Transaction Amount
		this.mpm.remove(54);
		// Remove Pix Key
		this.mpm.get<MultiField>(26)?.remove(1);
		// Remove Payment Description
		this.mpm.get<MultiField>(26)?.remove(2);
		// Set default Reference Label
		this.mpm.get<MultiField>(26)?.get<Field>(5)?.applyDefault('***');

		this.mpm = mpm;
		return this;
	}

	public url(url: string) {
		if (
			/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/i.test(
				url
			) === false
		) {
			throw new InvalidEmvFieldError(
				'Payment URL',
				url,
				'Não é uma URL válida'
			);
		}

		this.mpm.get<MultiField>(26)?.get<Field>(25)?.applyValue(url);
		return this;
	}
}
