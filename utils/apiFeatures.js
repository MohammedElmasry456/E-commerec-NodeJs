class ApiFeatures {
  constructor(reqQuery, mongooseQuery) {
    this.reqQuery = reqQuery;
    this.mongooseQuery = mongooseQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const exludesFields = ["page", "limit", "sort", "fields", "keyword"];
    exludesFields.forEach((e) => delete queryObj[e]);
    //Apply Filtering Using gte|gt|lte|lt
    let queryObjStr = JSON.stringify(queryObj);
    queryObjStr = queryObjStr.replace(/\b(gte|gt|lte|lt)\b/g, (s) => `$${s}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryObjStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
      if (fields.includes("category")) {
        this.mongooseQuery = this.mongooseQuery.populate({
          path: "category",
          select: "name -_id",
        });
      }
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
      // .populate({ path: "category", select: "name -_id" });
    }
    return this;
  }

  search(modelName) {
    if (this.reqQuery.keyword) {
      let query = {};
      if (modelName === "products") {
        query.$or = [
          { title: { $regex: this.reqQuery.keyword, $options: "i" } },
          { description: { $regex: this.reqQuery.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.reqQuery.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(countDocuments / limit);
    const endIndex = page * limit;

    if (skip > 0) {
      pagination.previous = page - 1;
    }
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    this.paginationResult = pagination;
    return this;
  }

  async count() {
    // Clone the original query to avoid altering it
    const queryClone = this.mongooseQuery.clone();

    // Execute the count on the cloned query
    const count = await queryClone.countDocuments();

    // Store the count in the instance
    this.count = count;
  }
}

module.exports = ApiFeatures;
