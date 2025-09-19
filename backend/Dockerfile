FROM python:3.10-slim AS builder

WORKDIR /app

# Install uv (modern pip replacement)
RUN pip install --no-cache-dir uv

# Copy requirements file
COPY requirements.txt .

# Create venv and install dependencies
RUN uv venv
RUN . .venv/bin/activate && uv pip install -r requirements.txt

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Copy venv from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application files
COPY . .

# Activate virtual environment and set PYTHONPATH
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"
ENV PORT=8000

# Use ENTRYPOINT to run uvicorn with single worker for development
ENTRYPOINT ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]