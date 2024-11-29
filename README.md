# Node.js API Gateway

This repository contains a fully-featured API Gateway application built with **Node.js** and **Express.js**, designed to handle dynamic HTTP forwarding and manage API services efficiently. The Gateway leverages **Axios** for handling HTTP requests and features a service registry to manage registered APIs dynamically.

## Key Features

### 1. Dynamic HTTP Forwarding
- The Gateway forwards incoming HTTP requests to the appropriate backend API endpoints dynamically.
- Enables seamless routing to multiple services without exposing their internal structures to the client.

### 2. Service Registry
- Includes a built-in service registry that tracks registered APIs.
- Services can be registered and unregistered dynamically through outward-facing endpoints.
- The registry ensures only valid and active services are accessible via the Gateway.

### 3. Outward-Facing API Endpoints
- Provides APIs for:
  - Registering new services to the Gateway.
  - Unregistering existing services.
  - Retrieving a list of all registered services.
- Allows services to integrate with the Gateway programmatically.

### 4. Axios Integration
- Axios is used for robust and efficient handling of HTTP requests between the Gateway and backend services.
- Supports error handling, retries, and custom configurations for various HTTP methods.

### 5. Express.js Routing
- Modular and efficient routing system for handling client requests.
- Middleware support for authentication, logging, and request validation.

## Technical Architecture

### Core Components
1. **Request Router**  
   Maps incoming requests to corresponding backend service endpoints.  
   Supports custom route configurations for advanced use cases.

2. **Service Registry**  
   Maintains metadata for registered services, such as:  
   - Service name  
   - Base URL  
   - Health status  
   Offers APIs to dynamically add, update, or remove services.

3. **Proxy Handler**  
   Forwards client requests to backend services based on routing rules.  
   Handles request/response transformations and error propagation.

4. **Middleware**  
   Implements middleware for:
   - Authentication: Validate tokens or credentials.
   - Logging: Track incoming and outgoing requests.
   - Rate Limiting: Control traffic to prevent overloading.

### Dependencies
- **Node.js**: Server runtime.
- **Express.js**: Framework for API routing and middleware integration.
- **Axios**: HTTP client for forwarding requests to backend APIs.


## API Endpoints

### Service Registry Endpoints
- **POST** `/register`: Register a new service.
  - **Body**:
    ```json
    {
      "name": "service-name",
      "url": "https://service-url.com"
    }
    ```

- **POST** `/unregister`: Unregister an existing service.
  - **Body**:
    ```json
    {
      "name": "service-name"
    }
    ```

- **GET** `/services`: Retrieve a list of all registered services.

### Dynamic Proxy Endpoints
- Forward requests to registered services based on their routing configuration.
  - Example: `GET /api/service-name/resource` is proxied to the registered service's URL.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DigitalCreationsCo/nodeJsApiGateway.git
   cd nodeJsApiGateway

## Configuration
Environment Variables:
PORT: Port number for the Gateway server (default: 3000).
LOG_LEVEL: Level of logging detail (e.g., info, debug).

## Usage
Register Services
Use the /register endpoint to add services to the Gateway dynamically.

Access Services
Send requests to the Gateway, and it will forward them to the appropriate service.

Unregister Services
Use the /unregister endpoint to remove services from the Gateway.
