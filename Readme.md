# Group Chat Web Services Application

This Node.js application provides web services to facilitate group chat and data management. The application includes Admin APIs for managing users and general user APIs for authentication, group management, and group messaging.

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Environment Variables](#environment-variables)
-   [API Endpoints](#api-endpoints)
-   [Testing](#testing)

## Features

### Admin APIs

-   **Manage Users**: Admins can create and edit users.

### Authentication APIs

-   **Login**: Allows users to authenticate.
-   **Logout**: Allows users to log out of the system.

### Group Management (Normal Users)

-   **Manage Groups**: Users can create and delete groups.
-   **Add Members**: Users can add members to groups.
-   **Remove Members**: Users can remove members to groups.
-   **View Users**: All users are visible to all other users.

### Group Messaging (Normal Users)

-   **Send Messages**: Users can send messages within groups.
-   **Like Messages**: Users can add and remove like messages in groups.

## Installation

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [Yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/)

### Clone the Repository

```bash
git clone https://github.com/sanjeetSangam/group-chat-apis.git
cd group-chat-apis
```

```bash
yarn install
```

## Run

```bash

yarn dev

```

## Environment Variables

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=TOKEN_SECRET
ACCESS_TOKEN_EXPIRY=1d
```

## Testing

```bash
yarn test
```

## API Endpoints

### Authentication

-   **POST /api/v1/users/login**

    -   Description: User login to get a token.
    -   Request Body:
        ```json
        {
        	"username": "admin",
        	"password": "admin"
        }
        ```
    -   Response: `200 OK` with a token.

-   **GET /api/v1/users/logout**
    -   Description: Log out the authenticated user.
    -   Response: `200 OK`

### Admin APIs

-   **POST /api/v1/users/admin/create**

    -   Description: Create a new admin user.
    -   Request Body:
        ```json
        {
        	"username": "admin",
        	"password": "admin",
        	"name": "Admin"
        }
        ```
    -   Response: `201 Created` with user data.

-   **POST /api/v1/users/create**

    -   Description: Create a new user (admin access only).
    -   Request Body:
        ```json
        {
        	"username": "newuser",
        	"password": "newpass",
        	"name": "John"
        }
        ```
    -   Response: `201 Created` with user data.

-   **PATCH /api/v1/users/edit/:userId**

    -   Description: Edit an existing user (admin access only).
    -   Request Body:
        ```json
        {
        	"username": "updated_username",
        	"name": "updated_John"
        }
        ```
    -   Response: `200 OK` with updated user data.

-   **DELETE /api/v1/users/delete/:userId**
    -   Description: Delete a user (admin access only).
    -   Response: `200 OK`

### Group Management

-   **POST /api/v1/group/create**

    -   Description: Create a new group.
    -   Request Body:
        ```json
        {
        	"name": "group1"
        }
        ```
    -   Response: `201 Created` with group data.

-   **PATCH /api/v1/group/add-members/:groupId**

    -   Description: Add members to a group.
    -   Request Body:
        ```json
        {
        	"memberIds": ["userId1", "userId2"]
        }
        ```
    -   Response: `200 OK` with updated group data.

-   **PATCH /api/v1/group/remove-members/:groupId**

    -   Description: Remove members from a group.
    -   Request Body:
        ```json
        {
        	"memberIds": ["userId1"]
        }
        ```
    -   Response: `200 OK` with updated group data.

-   **GET /api/v1/group/fetch**

    -   Description: Fetch all groups for the authenticated user.
    -   Response: `200 OK` with group data.

-   **GET /api/v1/group/:groupId/members**

    -   Description: Get all members of a group.
    -   Response: `200 OK` with member data.

-   **DELETE /api/v1/group/delete/:groupId**
    -   Description: Delete a group.
    -   Response: `200 OK`

### Group Messaging

-   **POST /api/v1/message/:groupId/create**

    -   Description: Send a message in a group.
    -   Request Body:
        ```json
        {
        	"content": "random message."
        }
        ```
    -   Response: `201 Created` with message data.

-   **PATCH /api/v1/message/edit/:messageId**

    -   Description: Edit a message.
    -   Request Body:
        ```json
        {
        	"content": "random message2."
        }
        ```
    -   Response: `200 OK` with updated message data.

-   **GET /api/v1/message/:groupId/get**

    -   Description: Get all messages in a group.
    -   Response: `200 OK` with messages data.

-   **DELETE /api/v1/message/delete/:messageId**
    -   Description: Delete a message.
    -   Response: `200 OK`

### Like/Unlike Messages

-   **POST /api/v1/like/toggle/:messageId**
    -   Description: Toggle like on a message.
    -   Response: `201 Created` if liked, `200 OK` if like removed.
