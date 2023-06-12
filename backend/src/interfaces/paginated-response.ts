export interface PaginatedResponse {
  data: any;
  pagination: {
    total_items: number;
    current_page: number;
    total_pages: number;
  };
}
