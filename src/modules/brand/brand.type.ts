// types/brand.type.ts
export interface Brand {
  id: string
  name: string
  url: string
  description?: string
}

// Form tạo/cập nhật Brand
export class BrandForm {
  name: string
  url: string
  description?: string

  constructor(name: string, url: string, description?: string) {
    this.name = name
    this.url = url
    this.description = description
  }
}
