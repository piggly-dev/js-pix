export default class InvalidPixCodeError extends Error {
	public readonly code;

	constructor(code: string) {
		super(`O código pix "${code}" é inválido.`);
		this.name = 'InvalidPixCodeError';
		this.code = code;
	}
}
