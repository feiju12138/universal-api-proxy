const app = require("./express/app");

const PORT = process.env.PORT || 9000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server start on http://127.0.0.1:${PORT}`);
  console.log(`Api Server start on http://127.0.0.1:${PORT}/api`);
});
