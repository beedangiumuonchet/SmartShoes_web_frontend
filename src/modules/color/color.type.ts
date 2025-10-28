// types/color.type.ts
export interface Color {
  id: string
  name: string
}

export class ColorForm {
  name: string

  constructor(name: string) {
    this.name = name
  }
}
