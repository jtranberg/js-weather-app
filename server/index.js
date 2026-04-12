import { app } from "./server.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CO2 server running on port ${PORT}`);
});