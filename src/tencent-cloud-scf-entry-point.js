const app = require("./express/app");

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server start on http://127.0.0.1:${PORT}`);
  console.log(`Api Server start on http://127.0.0.1:${PORT}/api`);
});
