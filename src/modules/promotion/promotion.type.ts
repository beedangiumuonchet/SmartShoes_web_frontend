// types/promotion.type.ts
import type { ProductVariant } from '../products/product.type'

export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'UPCOMING'

export interface Promotion {
  id: string
  name: string
  description?: string
  percent: number
  startDate: string
  endDate: string
  status: PromotionStatus
  products?: PromotionProductVariant[] 
}

export class PromotionForm {
  name: string
  description?: string
  percent: number
  start_date: string
  end_date: string
  status: PromotionStatus

  constructor(
    name: string,
    percent: number,
    start_date: string,
    end_date: string,
    status: PromotionStatus,
    description?: string,
  ) {
    this.name = name
    this.percent = percent
    this.start_date = start_date
    this.end_date = end_date
    this.status = status
    this.description = description
  }
}

export interface PromotionProductVariant {
  id: string
  status: string
  promotion: Promotion
  productVariant: ProductVariant
  createdAt: string
  updatedAt?: string
}

export interface PromotionProductRequest {
  promotionId: string
  productVariantId: string
}

