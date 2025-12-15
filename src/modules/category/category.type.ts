// types/category.type.ts
export interface Category {
  id: string
  name: string
  description?: string
  url?: string
  slug: string
}

export class CategoryForm {
  name: string
  description?: string

  constructor(name: string, description?: string) {
    this.name = name
    this.description = description
  }
}
