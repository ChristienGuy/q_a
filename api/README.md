# Getting Started

## API

Required Dependencies:

Docker
Docker Compose
Node 10+

### Initial Setup

Install local dependencies:

```bash
yarn
```

Start up postgres & the node server:

```bash
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

In a new terminal instance run initial migrations:

```bash
yarn migration:run
```

This will give you a database with an admin user but otherwise completely empty.

After this point you need to run:

```bash
docker-compose up
```

And then in a different terminal instance run

```
yarn start
```