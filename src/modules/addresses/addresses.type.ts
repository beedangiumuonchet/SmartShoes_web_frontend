// Interface cho Address từ API
export interface Address {
  id: string
  fullName: string
  phone: string
  street: string
  ward: string
  city: string
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

// Form để tạo/cập nhật address
export class AddressForm {
  fullName: string
  phone: string
  street: string
  ward: string
  city: string
  isDefault: boolean

  constructor(
    fullName: string = '',
    phone: string = '',
    street: string = '',
    ward: string = '',
    city: string = '',
    isDefault: boolean = false,
  ) {
    this.fullName = fullName
    this.phone = phone
    this.street = street
    this.ward = ward
    this.city = city
    this.isDefault = isDefault
  }
}

// Response types
export type CreateAddressResponse = Address
export type UpdateAddressResponse = Address
export type GetUserAddressesResponse = Address[] // Mảng addresses, không phải single
export type DeleteAddressResponse = void
