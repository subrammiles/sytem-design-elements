const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "user.proto");

// Load the Protocol Buffers definition.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the generated service definitions dynamically.
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const userPackage = protoDescriptor.user;

// Sample in-memory user database.
const users = {
  "101": {
    id: "101",
    name: "Subram",
    email: "subram@example.com",
  },
  "102": {
    id: "102",
    name: "Rahul",
    email: "rahul@example.com",
  },
};

// Implement the GetUser RPC.
function getUser(call, callback) {
  const userId = call.request.userId;

  console.log(`Received GetUser request for ID: ${userId}`);

  const user = users[userId];

  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found",
    });
  }

  // Return the user details.
  callback(null, user);
}

// Create the gRPC server.
const server = new grpc.Server();

// Register the service implementation.
server.addService(userPackage.UserService.service, {
  GetUser: getUser,
});

// Start listening for incoming requests.
const address = "127.0.0.1:50051";

server.bindAsync(
  address,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }

    console.log(`gRPC server listening on ${address}`);
  }
);