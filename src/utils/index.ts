import deburr from 'lodash.deburr';

export function CRC16(payload: string): string {
	const polynomial = 0x1021;
	const len = payload.length;

	let response = 0xffff;

	if (len > 0) {
		for (let offset = 0; offset < len; offset++) {
			response ^= payload.charCodeAt(offset) << 8;

			for (let bitwise = 0; bitwise < 8; bitwise++) {
				response <<= 1;

				if (response & 0x10000) {
					response ^= polynomial;
				}

				response &= 0xffff;
			}
		}
	}

	return response.toString(16).padStart(4, '0').toUpperCase();
}

export function cleanString(value: string): string {
	return deburr(value);
}
