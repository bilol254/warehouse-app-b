export interface User {
  id: number;
  name: string;
  username: string;
  role: 'manager' | 'seller';
}

export interface Product {
  id: number;
  sku?: string;
  name: string;
  category?: string;
  unit: string;
  created_at: string;
  is_active: number;
  current_qty: number;
  minimal_price_per_unit: number;
  recommended_price_per_unit: number;
  promo_type?: string;
  promo_value?: number;
}

export interface Purchase {
  id: number;
  product_id: number;
  qty_in: number;
  buy_price_per_unit: number;
  expense_total: number;
  arrived_at: string;
  note?: string;
  name?: string;
  sku?: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  qty: number;
  sell_price_per_unit: number;
  cost_price_per_unit_snapshot: number;
  line_total: number;
  line_profit: number;
  name?: string;
  unit?: string;
}

export interface Sale {
  id: number;
  seller_id: number;
  seller_name?: string;
  sold_at: string;
  customer_name?: string;
  payment_type?: string;
  total_sum: number;
  total_profit: number;
  items?: SaleItem[];
}

export interface PricingRule {
  id: number;
  product_id: number;
  minimal_price_per_unit: number;
  recommended_price_per_unit?: number;
  promo_type?: string;
  promo_value?: number;
  promo_start?: string;
  promo_end?: string;
}

export interface DashboardStats {
  today_stats: {
    sales_count: number;
    total_revenue: number;
    total_profit: number;
  };
  top_products: Array<{
    id: number;
    name: string;
    qty_sold: number;
    revenue: number;
  }>;
}
