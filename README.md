# Image Processing API

A simple Node.js API for resizing images on demand, built with Express and TypeScript.  
This project was developed as part of the Udacity Full Stack JavaScript Nanodegree.

---

## Features

- Resize images via HTTP endpoint
- Caches resized images for faster subsequent access
- Written in TypeScript
- Linting with ESLint and formatting with Prettier
- Unit tests with Jasmine and Supertest

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

## Scripts

| Command            | Description                                 |
|--------------------|---------------------------------------------|
| `npm run build`    | Compile TypeScript to JavaScript            |
| `npm run start`    | Start the development server with Nodemon   |
| `npm run test`     | Build and run all Jasmine tests             |
| `npm run lint`     | Run ESLint on all source files              |
| `npm run lint:fix` | Auto-fix lint issues                        |
| `npm run prettier` | Format code using Prettier                  |

---

## Usage

Start the server:
```sh
npm start
```

### Resize Endpoint

**GET** `/api/images?filename=<name>&width=<number>&height=<number>`

- Example:
  ```
  http://localhost:3000/api/images?filename=encenadaport&width=200&height=200
  ```

- On first request, the image is resized and cached in `assets/thumbs/`.
- On subsequent requests, the cached image is served.

---

## Project Structure

```
assets/
  full/      # Original images
  thumbs/    # Cached resized images
src/
  routes/
    api/
      imageProcessingController.ts
    index.ts
  services/
    imageProcesser.ts
  index.ts
  tests/
    resizedImagesSpec.ts
    helpers/
      reporter.ts
```

---

## Linting & Formatting

- ESLint config: `.eslintrc`
- Prettier config: `.prettierrc`
- Ignore files: `.eslintignore`, `.prettierignore`

---

## Testing

Run all tests:
```sh
npm test
```

---

## License

ISC

---

## Author

Mohammed Nafee
