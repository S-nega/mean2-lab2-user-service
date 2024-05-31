const News = require('../models/news');

const resolvers = {
  Query: {
    getAllNews: async () => {
      return await News.find();
    },
    getNewsById: async (_, { id }) => {
      return await News.findById(id);
    },
  },
  Mutation: {
    createNews: async (_, { title, content, author }) => {
      const news = new News({ title, content, author, publishedDate: new Date().toISOString() });
      await news.save();
      return news;
    },
    updateNews: async (_, { id, title, content, author }) => {
      const news = await News.findByIdAndUpdate(
        id,
        { title, content, author, publishedDate: new Date().toISOString() },
        { new: true }
      );
      return news;
    },
    deleteNews: async (_, { id }) => {
      const news = await News.findByIdAndDelete(id);
      return news;
    },
  },
};

module.exports = resolvers;
