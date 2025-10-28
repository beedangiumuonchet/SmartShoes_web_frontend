// types/attribute.type.ts
export interface Attribute {
  id: string
  key: string
  value: string
  description?: string
}

export class AttributeForm {
  key: string
  value: string
  description?: string

  constructor(key: string, value: string, description?: string) {
    this.key = key
    this.value = value
    this.description = description
  }
}
