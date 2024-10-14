import app from "./src/app";

const startServer = () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`server listen at ${PORT}`);
  });
};

startServer();
