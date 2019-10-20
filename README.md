# Getting Started

## API

Start up the postgres container:

```bash
cd api

docker-compose up
```

exec into postgres container:

```bash
docker exec -it postgres psql -U postgres
```

Create db called `qa`:

```sql
CREATE DATABASE qa;
```

Then to start up the TS server:

```bash
npm start
```

Run initial migrations:

```bash
npm run migration:run
```

This will give you a database with an admin user but otherwise completely empty.
