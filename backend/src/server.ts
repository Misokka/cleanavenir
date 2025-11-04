import { createServer } from './interface/http-express/main';

const port = process.env.PORT || 3000;

const app = createServer();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
