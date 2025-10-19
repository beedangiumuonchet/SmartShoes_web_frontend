// Interface cho User Profile từ API /v1/auth/me
export interface UserProfile {
  userId: string
  email: string
  username: string
  firstName: string
  lastName: string
  phoneNumber?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  birthday?: string
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  createdAt: string
  updatedAt: string

  roles: UserRole[]
  addresses: UserAddress[]

  // JWT token fields (nếu BE trả về từ /v1/auth/me)
  iat?: number // Issued at timestamp
  exp?: number // Expiry timestamp
}

// Interface cho Role trong profile
export interface UserRole {
  id: string
  name: string
  description: string
}

// Interface cho Address trong profile
export interface UserAddress {
  id: string
  recipientName: string
  phoneNumber: string
  street: string
  ward: string
  province: string
  isDefault: boolean
}

// Form để cập nhật profile
export class UpdateProfileForm {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  birthday?: string

  constructor(
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    gender?: 'MALE' | 'FEMALE' | 'OTHER',
    birthday?: string,
  ) {
    this.email = email
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNumber = phoneNumber
    this.gender = gender
    this.birthday = birthday
  }
}

// Form đổi mật khẩu
export class ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string

  constructor(currentPassword: string, newPassword: string, confirmPassword: string) {
    this.currentPassword = currentPassword
    this.newPassword = newPassword
    this.confirmPassword = confirmPassword
  }
}

// Response cho upload avatar
export interface UploadAvatarResponse {
  avatarUrl: string
}
