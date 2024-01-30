const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const paginationMiddleware = (req, res, next) => {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;

    // Convert page and limit to integers
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    // Add pagination properties to request object
    req.pagination = {
        offset: (parsedPage - 1) * parsedLimit,
        limit: parsedLimit,
    };

    next();
};

module.exports = paginationMiddleware;
