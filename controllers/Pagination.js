const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * size : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: result } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalPages, currentPage, result };
};

module.exports = { getPagination, getPagingData };
