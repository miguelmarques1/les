export function fromValue<T extends Record<string, string | number>>(enumType: T, value: string): T[keyof T] | undefined {
    const upperValue = value?.toUpperCase();
    return Object.values(enumType).includes(upperValue as T[keyof T]) ? (upperValue as T[keyof T]) : undefined;
}