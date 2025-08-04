class APIFunctionality {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // 🔍 SEARCH: match 'name', 'category', or 'description' using keyword
    search() {
        const keyword = this.queryString.keyword
            ? {
                $or: [
                    { name: { $regex: this.queryString.keyword, $options: 'i' } },
                    { category: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ]
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // 🔧 FILTER: e.g., price[gte]=1000&rating[lt]=4
    filter() {
        const queryCopy = { ...this.queryString };

        // Remove non-filter fields
        const removeFields = ['keyword', 'page', 'limit'];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Convert operators to MongoDB format: gt, gte, lt, lte
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        const parsedQuery = JSON.parse(queryStr);

        this.query = this.query.find(parsedQuery);
        return this;
    }

    // 📄 PAGINATION: skips & limits results
    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default APIFunctionality;
