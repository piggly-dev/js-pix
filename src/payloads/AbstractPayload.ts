import QRCode from 'qrcode';

import Field from '@/emv/Field';
import MPM from '@/emv/MPM';
import { cleanString } from '@/utils';
import { TValueOf } from '@/types';
import QRCodeEnum from '@/enums/QRCodeEnum';

export default abstract class AbstractPayload {
	protected mpm;

	constructor() {
		this.mpm = new MPM();
	}

	public merchantName(merchantName: string) {
		this.mpm
			.get<Field>(59)
			?.applyValue(cleanString(merchantName).toUpperCase());
		return this;
	}

	public merchantCity(merchantCity: string) {
		this.mpm
			.get<Field>(60)
			?.applyValue(cleanString(merchantCity).toUpperCase());
		return this;
	}

	public postalCode(postalCode: string) {
		this.mpm
			.get<Field>(61)
			?.applyValue(cleanString(postalCode).toUpperCase());
		return this;
	}

	public pixCode(): string {
		return this.mpm.export();
	}

	public async qrCode(ecc: TValueOf<typeof QRCodeEnum>): Promise<string> {
		return await QRCode.toString(this.pixCode(), {
			type: 'svg',
			errorCorrectionLevel: ecc,
		});
	}

	public getMPM(): MPM {
		return this.mpm;
	}
}
