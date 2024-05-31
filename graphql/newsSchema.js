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
      // Здесь должен быть код для получения всех новостей
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
