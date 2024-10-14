import app from "./src/app";
import { config } from "./src/config/config";

const startServer = () => {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`server listen at ${PORT}`);
  });
};

startServer();
