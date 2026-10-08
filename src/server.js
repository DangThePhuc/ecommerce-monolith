const app = require('./app');
const { port } = require('./config/env');

app.listen(port, (err) => {
  if (err) {
    console.error('Không khởi động được server:', err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
});