
  export interface Voucher {
    id: number; // Unique identifier
    name: string; // Name of the voucher
    description?: string; // Description (optional)
    code: string; // Unique voucher code
    creatorId: number; // ID of the creator (foreign key)
    approvalId?: number; // ID of the approver (optional foreign key)
    status: string; // Status of the voucher (e.g., pending, approved)
    discount_percentage: number; // Discount percentage (decimal)
    deletedAt?: Date; // Soft delete timestamp (optional)
    createdAt: Date; // Timestamp when created
    updatedAt: Date; // Timestamp when last updated
  }


