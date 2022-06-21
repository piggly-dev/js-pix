import Field from '@/emv/Field';
import MultiField from '@/emv/MultiField';

export type TOrUndefined<T> = T | undefined;
export type TValueOf<T> = T[keyof T];
export type TEMVAvailableFields = Field | MultiField;
