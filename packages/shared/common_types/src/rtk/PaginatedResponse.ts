export type PaginatedResponse<T> = {
    items: T[];
    meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
    };
};