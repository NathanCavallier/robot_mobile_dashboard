# robot_mobile_dashboard

Dashboard du Robot Mobile avec Pince et caméras

## Configuration

The application relies on several environment variables for both the backend
and the frontend. Copy the provided examples and adjust the values to fit your
setup.

### Backend

Create a `.env` file at the project root based on `.env.example` and set the
following variables:

- **MONGO_URI** – MongoDB connection string used by the backend.
- **PORT** – Port on which the Node.js server runs.
- **JWT_SECRET** – Secret key used to sign JWT tokens.
- **FRONTEND_URL** – URL of the Next.js application allowed by CORS.
- **DEFAULT_ADMIN_USERNAME** – Username for the default administrator account.
- **DEFAULT_ADMIN_EMAIL** – Email of the default administrator.
- **DEFAULT_ADMIN_PASSWORD** – Password for the default administrator.

### Frontend

Inside the `frontend` folder, create a `.env` file from `frontend/.env.example`.
It defines the connection endpoints used by the dashboard:

- **NEXT_PUBLIC_API_BASE_URL** – Base URL of the backend REST API.
- **NEXT_PUBLIC_WS_URL** – WebSocket server URL.
- **NEXT_PUBLIC_FLASK_API_URL** – URL of the Flask API for image prediction.

## Testing

To run the backend test suite:

```bash
cd backend
npm test
```

Jest will execute all files under `backend/tests/`.
