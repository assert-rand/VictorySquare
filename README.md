# Victory Square

---
Subhajeet Lahiri, Harsh Kumar
---

VictorySquare is a chess application that enables users to connect, play, and interact in real-time. The following sections outline its major functionalities and their underlying implementations.

---

## **1. User Authentication**
   - **What it does**:
     - Allows users to register, authenticate, and validate tokens for secure access to the application.
   - **How it is implemented**:
     - **Registration (`/register`)**: 
       - Takes a `RegisterRequest` object containing `username`, `email`, and `password`.
       - Uses the `AuthenticationService` to create a new user and return an authentication token(`jwt`).
     - **Authentication (`/authenticate`)**:
       - Validates the user’s `email` and `password`.
       - Generates and returns an authentication token upon successful validation(`jwt`).
     - **Token Validation (`/validate/{token}`)**:
       - Checks the validity of a `jwt` using the app's secret key and verifies the claims made by the user.
     - **Underlying logic**:
       - The service relies on `AuthenticationService`, which handles user data storage, password encryption, and token generation/validation.
---

## **2. User Management**
   - **What it does**:
     - Allows searching for users, managing game invitations, and handling notifications.
   - **How it is implemented**:
     - **Search for a User (`/search`)**:
       - Retrieves a user by email from the `UserRepository`.
       - Omits sensitive details (e.g., password) before returning the user’s profile.
     - **Game Invitations (`/invite`)**:
       - Sends game invitations to other users.
       - Uses the `Notification` model to create a new notification containing:
         - Game code
         - Inviter’s email and name
       - Enforces a limit of 10 notifications per user. If exceeded, the API returns a bad request.
       - Saves notifications back to the user in `UserRepository`.
     - **Notifications**:
       - **Retrieve Notifications (`/notification/get`)**:
         - Fetches all notifications for a user by querying `UserRepository`.
       - **Delete Notifications (`/notification/delete`)**:
         - Deletes a specific notification for a user by ID.
         - Updates the user’s notifications in the database.
     - **Underlying logic**:
       - All user-related operations interact with the `UserRepository` for persistence.
       - Notifications are encapsulated in the `Notification` model, which supports operations like adding and removing notifications.

---

## **3. Game Creation and Management**
   - **What it does**:
     - Creates and manages active games in memory.
     - Acts as a communication medium between clients by storing and sharing the latest game state.
   - **How it is implemented**:
     - **Game Storage**:
       - Games are stored in a `ConcurrentHashMap`, where the key is a unique game ID (e.g., game code) and the value is the current game state.
       - The game state includes the FEN (Forsyth–Edwards Notation) string representing the current board configuration.
     - **Game Creation**:
       - When a game is created, a unique game ID is generated.
       - An initial FEN string representing the starting board configuration is stored in the `ConcurrentHashMap`.
     - **Server as a Communication Medium**:
       - The server acts as a central point for game state communication.
       - Each client polls the server to retrieve the latest FEN string and updates their UI accordingly.
       - When a client makes a move, the updated FEN string is sent back to the server, which updates the game state in the `ConcurrentHashMap`.
   - **Concurrency Management**:
       - The use of `ConcurrentHashMap` ensures thread-safe updates to the game state, allowing multiple users to interact with the same game without race conditions or data inconsistencies.
---
## **Underlying Concepts**
   - **Controller Layer**:
     - The application uses Spring Boot controllers (`AuthenticationController`, `UserController`, and `GameController`) to define RESTful endpoints.
     - Controllers handle HTTP requests, validate input, and call the appropriate services/repositories for processing.
   - **Service Layer**:
     - The `AuthenticationService` encapsulates logic for user authentication and token handling.
   - **Persistence Layer**:
     - The `UserRepository` stores and retrieves user data, including profiles and notifications.
     - Notifications are embedded within the user entity for easy association.
   - **In-memory Game State**:
     - The server uses a `ConcurrentHashMap` to efficiently manage active game states and facilitate client-server communication.

---

VictorySquare’s architecture ensures secure authentication, intuitive user management, and robust real-time game handling, making it a well-rounded solution for P2P chess.


