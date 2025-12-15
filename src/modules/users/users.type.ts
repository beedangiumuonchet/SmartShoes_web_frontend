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

// ✅ Interface cho UserDto từ Backend
export interface UserDto {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  birthday?: string // LocalDate từ BE -> string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  phoneNumber?: string
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  roles: string[] // Set<String> từ BE -> string[]
  createdAt: string
  updatedAt: string
}

// ✅ Interface cho UserRequest tạo/cập nhật user
export interface UserRequest {
  email: string
  username: string
  firstName: string
  lastName: string
  birthday?: string // LocalDate
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  phoneNumber?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  password?: string // Required khi tạo, optional khi update
  roles?: string[] // Set<String>
}

// ✅ Interface cho Create User Request (có password bắt buộc)
export interface CreateUserRequest extends UserRequest {
  password: string // Bắt buộc khi tạo user
}

// ✅ Interface cho Update User Request (password optional)
export interface UpdateUserRequest extends Omit<UserRequest, 'password'> {
  password?: string // Optional khi update
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

// Form để cập nhật profile (cho current user)
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
  oldPassword: string
  newPassword: string
  confirmPassword: string

  constructor(oldPassword: string, newPassword: string, confirmPassword: string) {
    this.oldPassword = oldPassword
    this.newPassword = newPassword
    this.confirmPassword = confirmPassword
  }
}

// Response cho upload avatar
export interface UploadAvatarResponse {
  avatarUrl: string
}

// ✅ Interface cho Pagination Response
export interface PagedData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// ✅ Interface cho Assign/Remove Role Response
export interface RoleAssignmentResponse {
  userId: string
  roleId: string
  message: string
}

// ✅ Enum cho User Status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

// ✅ Enum cho Gender Status
export enum GenderStatus {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// ✅ Interface cho User Filter/Search
export interface UserSearchParams {
  page?: number
  size?: number
  sort?: string
  email?: string
  username?: string
  status?: UserStatus
  role?: string
}

// ✅ Interface cho Role entity từ BE
export interface Role {
  id: string // UUID từ bảng roles
  name: string // Tên role như "ADMIN", "MANAGER", "USER"
  description: string // Mô tả role
  deleted: boolean
  createdAt: string
  updatedAt?: string
}
// ✅ THÊM MỚI - Interface cho RoleRequest tạo role mới
export interface RoleRequest {
  name: string // Required, 2-50 chars
  description: string // Required, max 255 chars
}

// ✅ THÊM MỚI - Interface cho TopCustomerDTO từ BE
export interface TopCustomerDTO {
  customer: UserDto // Thông tin khách hàng
  totalOrders: number // Tổng số đơn hàng thành công
  totalSpent: number // Tổng tiền đã mua (double từ BE)
}
