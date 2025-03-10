# URL Shortener

This project is a simple URL shortener built with Next.js, MongoDB, and Tailwind CSS. It allows users to input a long URL and generate a shortened version.  The shortened URL redirects to the original URL when visited.

### **Website: https://trimmed.vercel.app**

## Features

*   **URL Shortening:** Takes a long URL as input and generates a short, unique URL.
*   **Redirection:** Redirects shortened URLs to their original destinations.
*   **Hit Counting:** Tracks the number of times a shortened URL has been accessed.
*   **Duplicate URL Handling:**  If a URL has already been shortened, it returns the existing shortened URL instead of creating a new one. Prevents shortening of the base URL itself.
*   **Client-side Validation:** Uses `is-url` to check if the entered URL is valid on the frontend before sending it to the server.
*   **Error Handling:** Displays informative messages to the user for various scenarios (invalid URL, error conditions) using `notistack`.
* **Responsive Design:** Adapts to various screen sizes.
* **Font Optimization:** Uses the next/font optimization for Geist and Geist Mono.



## Project Structure

The project has the following key files:

*   **`index.js`:**  The main frontend component.  Handles user input (the URL to be shortened), displays the shortened URL, and interacts with the backend API endpoints. Includes loading states and error handling (with `notistack` snackbars).
*   **`add.js`:**  The API route (`/api/add`) responsible for creating new shortened URLs. It handles:
    *   Receiving the original URL.
    *   Normalizing the URL (using `getNormalizedURL`).
    *   Checking if the URL has already been shortened.
    *   Generating a unique short code (using `nanoid`).
    *   Saving the original and shortened URLs to the database.
    *  Avoiding shortening the service's own base URL.
*   **`get.js`:** The API route (designed to be /api/get, but used via @[code].js) responsible getting the expanded URL, incrementing stats, and is what redirects clients
    *   Receiving a shortened code.
    *   Retrieving the corresponding original URL from the database.
    *   Incrementing the hit count for the URL.
    *   Returning original URL.
*   **`@[code].js`:** The dynamic route that handles redirection. It intercepts requests containing a short code, queries the database for the corresponding original URL, and redirects the user.
* **`utils/dbConnect.js`:** Handles the connection to the MongoDB database.
* **`models/Urls.js`:** Defines the Mongoose schema for storing URL data (`original URL, shortened URL, hit count`).

## Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn
*   MongoDB (either locally installed or a cloud-hosted instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/omarabdiwali/url-short.git
    cd <project_directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following, replacing the placeholder with your actual MongoDB connection string and base URL:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    NEXT_PUBLIC_URL=http://localhost:3000/
    ```
    **Important:** The `NEXT_PUBLIC_URL` should reflect the base URL where your application is deployed (e.g., `https://my-url-shortener.com/`).  This is crucial for generating correct shortened URLs and handling redirections. For local development, typically `http://localhost:3000/` is used


### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  **Open your browser and visit `http://localhost:3000`**

## API Endpoints

*   **`POST /api/add`:**
    *   **Request Body:** `{ "url": "<original_url>" }`
    *   **Response:**
        *   On success (new URL created): `{ "message": "<shortened_url>", "kind": "created" }`
        *   On success (URL already exists): `{ "message": "<shortened_url>", "kind": "exists" }`
        *   On error (base URL submitted): `{"message": "URL from base website cannot be shortened again!", "kind": "error"}`
* **`POST /api/get`:**
    *    **Request Body:** `{ "code": "<short_code>"}`
    *   **Response**
        *   On success:  `{url: "<original_url>"}`
        *   On error: `{url: "<base_url>"}`

## Deployment

You can deploy this application to platforms like Vercel, Netlify, or any other platform that supports Next.js applications.  Make sure to set the `MONGODB_URI` and `NEXT_PUBLIC_URL` environment variables correctly in your deployment environment.

## Libraries Used
*   **Next.js:** React framework for building server-rendered and statically generated web applications.
*   **Mongoose:** Library used for interacting with MongoDB.
*   **Tailwind CSS:** CSS framework for styling.
*   **nanoid:** A tiny, secure, URL-friendly unique string ID generator.
*   **is-url:**  A library for checking if a given string is a valid URL.
*   **notistack:** A library for displaying snackbar notifications.
*  **next/font**: Used to easily manage and optimize website fonts

## Improvements & Future Enhancements

*   **Custom Short Codes:** Allow users to optionally specify a custom short code instead of using a randomly generated one.
*   **Detailed Analytics:** Track more detailed analytics, such as referrer information, geolocation, and timestamps of clicks.
*   **User Authentication:** Implement user authentication to allow users to manage their shortened URLs.
*   **Expiration:** Add an option to set an expiration date for shortened URLs.
*   **Rate Limiting:** Implement rate limiting to prevent abuse.
*   **Error Page:** Improve handling of invalid short codes (e.g., display a 404 page instead of just redirecting, or show an error message).
* **Testing**: Add unit and integration tests.
* **Caching**: Implement caching strategies for improved performance, especially in /api/get.