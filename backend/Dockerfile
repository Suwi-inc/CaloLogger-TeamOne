FROM python:3.11-buster as builder

RUN pip install poetry==1.7.1

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1

# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY pyproject.toml poetry.lock ./
RUN touch README.md

RUN poetry install --without dev --no-root

FROM python:3.11-slim-buster as runtime

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

WORKDIR /code

ENV VIRTUAL_ENV=/code/.venv \
    PATH="/code/.venv/bin:$PATH"


COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# Now copy the rest of the application
COPY app /code/app
COPY run.py /code

# Set the command to run the application
CMD ["python", "run.py"]

