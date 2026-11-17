# Mithra

### Frontend

Inside `frontend` folder
`npm run build`

### Run app
`uv run fastapi dev`


### Database

`uv run python -m backend.seed`

From project root:
```
uv run alembic -c backend/alembic.ini revision --autogenerate -m "create users table"
uv run alembic -c backend/alembic.ini upgrade head
```
