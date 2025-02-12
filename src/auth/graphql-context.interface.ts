export interface GraphQLContext {
  req: Request; // Or Express.Request if you're using Express
  user?: any; // Define the type of your user object
  // ... other properties
}
