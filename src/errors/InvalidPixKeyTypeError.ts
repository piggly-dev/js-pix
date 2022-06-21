export default class InvalidPixKeyTypeError extends Error {
	public readonly type;

	constructor(type: string) {
		super(`O tipo da chave "${type}" é inválido.`);
		this.name = 'InvalidPixKeyTypeError';
		this.type = type;
	}
}
