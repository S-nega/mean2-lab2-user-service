const { gql } = require('apollo-server-express');

// Определение схемы
const typeDefs = gql`
  type News {
    id: ID!
    title: String!
    content: String!
    author: String!
    publishedAt: String!
  }

  type Query {
    news: [News!]!
    newsById(id: ID!): News
  }

  type Mutation {
    addNews(title: String!, content: String!, author: String!): News!
  }
`;

// Реализация резолверов
const resolvers = {
  Query: {
    news: async () => {
      // код для получения всех новостей
      const {keyword} = req.params;
      console.log("keyword = " + keyword);
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword parameter is required' });
      }
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
        const data = response.data;
        console.log(data);
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      return [];
    },
    newsById: async (_, { id }) => {
      // Здесь должен быть код для получения новости по id
      return null;
    }
  },
  Mutation: {
    addNews: async (_, { title, content, author }) => {
      // Здесь должен быть код для добавления новости
      return { id: '1', title, content, author, publishedAt: new Date().toISOString() };
    }
  }
};

module.exports = { typeDefs, resolvers };
