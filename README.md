# Getting Started

## API

Required Dependencies:

Docker
Docker Compose
Node 10+

### Initial Setup

Install local dependencies:

```bash
npm i
```

Start up postgres & the node server:

```bash
npm start
```

exec into postgres container:

```bash
docker exec -it postgres psql -U postgres
```

Create db called `qa`:

```sql
CREATE DATABASE qa;
```

In a new terminal instance run initial migrations:

```bash
npm run migration:run
```

This will give you a database with an admin user but otherwise completely empty.

After this point you can just run:

```bash
npm start
```
