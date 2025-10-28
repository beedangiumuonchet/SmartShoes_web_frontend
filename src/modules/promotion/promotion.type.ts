// types/promotion.type.ts
export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

export interface Promotion {
  id: string
  name: string
  description?: string
  percent: number
  start_date: string
  end_date: string
  status: PromotionStatus
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
