export default class InvalidEmvFieldError extends Error {
	public readonly field;
	public readonly value;
	public readonly error;

	constructor(field: string, value: string, error: string) {
		super(
			`O valor "${value}" para o EMV "${field}" é inválido: ${error}.`
		);

		this.name = 'InvalidEmvFieldError';

		this.field = field;
		this.value = value;
		this.error = error;
	}
}
