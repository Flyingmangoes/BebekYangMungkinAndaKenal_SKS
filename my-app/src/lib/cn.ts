type ClassValue = string | number | false | null | undefined | ClassValue[]

function flattenClassValue(value: ClassValue): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(flattenClassValue)
  }

  if (value === false || value === null || value === undefined || value === '') {
    return []
  }

  return [String(value)]
}

export function cn(...values: ClassValue[]): string {
  return values.flatMap(flattenClassValue).join(' ')
}
