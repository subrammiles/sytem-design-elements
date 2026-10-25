

# user.proto

What does this file do?

It defines the API contract shared by the client and server.
- GetUser is the RPC method.
- GetUserRequest defines the incoming request.
- GetUserResponse defines the returned user details.
For example, the client sends a request containing user_id: "101".


#

Understand the server
A. Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

This loads the API definition dynamically at runtime. With keepCase: false, the Protobuf field user_id becomes userId in JavaScript.

B. Handle the RPC
function getUser(call, callback) {
  const userId = call.request.userId;
  const user = users[userId];

  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found",
    });
  }

  callback(null, user);
}

The handler receives two important arguments:
- call: Contains the incoming request and RPC context.
- callback: Sends either an error or a successful response back to the client.
callback(null, user) means the request succeeded.

C. Register the service
server.addService(userPackage.UserService.service, {
  GetUser: getUser,
});

This connects the RPC method defined in user.proto to the JavaScript function that implements it.

# Client
Understand the client
The most important part is:
client.GetUser(
  { userId: "101" },
  { deadline: Date.now() + 5000 },
  (error, response) => {
    // Handle the result.
  }
);

This sends the request to the remote server.

The arguments are:
1. { userId: "101" } — the request payload.
2. { deadline: Date.now() + 5000 } — the deadline, five seconds from now.
3. The callback — handles the response or error.
The client stub is generated dynamically from the .proto definition.

# Test
Run the application
Open two terminals in your project directory.

Terminal 1 — Start the server:
node server.js

Expected output:
gRPC server listening on 127.0.0.1:50051

Terminal 2 — Run the client:
node client.js

Expected output:
User details received:
ID: 101
Name: Subram
Email: subram@example.com

The server terminal should show:
Received GetUser request for ID: 101

You've now implemented a complete Node.js gRPC client-server application!