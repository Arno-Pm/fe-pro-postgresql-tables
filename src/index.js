import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'dbtask',
    password: POSTGRES_PASSWORD || '567RTY89001a',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();
  await client.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE
  );`);
  await client.query(`CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
  );`);
  await client.query(`CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
  );`);
  await client.query(`CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    userid INTEGER NOT NULL,
    authorid INTEGER NOT NULL,
    categoryid INTEGER NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (authorid) REFERENCES authors (id) ON DELETE CASCADE,
    FOREIGN KEY  (categoryid) REFERENCES categories (id) ON DELETE CASCADE
  );`);
  await client.query(`CREATE TABLE descriptions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(10000) NOT NULL,
    bookid INT UNIQUE NOT NULL,
    FOREIGN KEY (bookid) REFERENCES books (id) ON DELETE CASCADE
  );`);
  await client.query(`CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    message VARCHAR(10000) NOT NULL,
    userid INT NOT NULL,
    bookid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (bookid) REFERENCES books (id) ON DELETE CASCADE
  );`)
  client.end();
};


export const createItems = async () => {
  const client = initConnection();
  client.connect();
  // Богдан сори, небольшой спам в базе ,  по ошибке создал три id в бд, а так все рабоатет) 
  await client.query(`INSERT INTO users(name) VALUES('Egor ');`);
  await client.query(`INSERT INTO categories(name) VALUES('IT sphere');`);
  await client.query(`INSERT INTO authors(name) VALUES('Egor Gostryck');`);
  await client.query(`INSERT INTO books(title, userid, authorid, categoryid) VALUES('Book about success', 1, 1, 1);`);
  await client.query(`INSERT INTO descriptions(description, bookid) VALUES('Shut up and take my money', 1);`);
  await client.query(`INSERT INTO reviews(name) VALUES('Egor ', 1);`);
  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
