const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "user.proto");

// Load the same API definition used by the server.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const userPackage = protoDescriptor.user;

// Create a client stub.
const client = new userPackage.UserService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

// Call the remote GetUser method.
client.GetUser(
  { userId: "101" },
  { deadline: Date.now() + 5000 },
  (error, response) => {
    if (error) {
      if (error.code === grpc.status.NOT_FOUND) {
        console.error("User not found");
      } else {
        console.error("gRPC request failed:", error.message);
      }

      client.close();
      return;
    }

    console.log("User details received:");
    console.log("ID:", response.id);
    console.log("Name:", response.name);
    console.log("Email:", response.email);

    client.close();
  }
);