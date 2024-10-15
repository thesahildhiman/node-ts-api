import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
  // db connection
  await connectDB();
  //   server connection
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`server listen at ${PORT}`);
  });
};

startServer();
