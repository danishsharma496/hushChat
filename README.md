 # Backend Server API Documentation

This backend server API provides endpoints for chat functionality and product search. It utilizes the Gemini API for chat capabilities and integrates with Amazon to fetch product data.

## Endpoints

### 1. `GET /`

- **Description:** Initializes the chat model.
- **Response:** A success message indicating that the chat model has been initialized.

### 2. `POST /chat`

- **Description:** Accepts user input and returns a response from the chat model.
- **Request Body:** JSON object containing the user input (`userInput`).
- **Response:** JSON object containing the response from the chat model.

### 3. `POST /product`

- **Description:** Accepts a product query and fetches relevant product data from Amazon.
- **Request Body:** JSON object containing the product query (`userInput`).
- **Response:** JSON object containing the product data fetched from Amazon.

## Dependencies

- **Express:** A Node.js web application framework used for building the server.
- **Axios:** A promise-based HTTP client for making requests to external APIs.
- **@google/generative-ai:** Provides access to the Gemini API for chat capabilities.
- **dotenv:** Loads environment variables from a `.env` file.
- **cors:** Middleware for enabling Cross-Origin Resource Sharing (CORS).

## Environment Variables

- **PORT:** The port on which the server will listen for incoming requests.
- **API_KEY:** API key required for accessing the Gemini API.
- **RAPIDAPI_KEY:** API key required for accessing the Amazon API.
