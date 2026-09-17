export const getPagination = (req) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    return {
        page,
        limit,
        skip: (page - 1) * limit
    };
};
export const meta = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
});