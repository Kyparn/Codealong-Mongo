import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import BodyParser from 'body-parser'

const mongoUrl = process.env.MOGNO_URL || 'mongodb://localhost/books'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Author = mongoose.model('Author', {
  name: String,
})

const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
})
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Author.deleteMany()
    const tolkien = new Author({ name: 'J.R.R Tolkien' })
    await tolkien.save()

    const rowling = new Author({ name: 'J.K. Rowling' })
    await rowling.save()
    await new Book({
      title: "Harry Potter and the Philosopher's Stone",
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Chamber of Secrets',
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Prisoner of Azkaban',
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Goblet of Fire',
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Order of the Phoenix',
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Half-Blood Prince',
      author: rowling,
    }).save()
    await new Book({
      title: 'Harry Potter and the Deathly Hallows',
      author: rowling,
    }).save()
    await new Book({ title: 'The Lord of the Rings', author: tolkien }).save()
    await new Book({ title: 'The Hobbit', author: tolkien }).save()
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
app.use(BodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Technigo!')
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
