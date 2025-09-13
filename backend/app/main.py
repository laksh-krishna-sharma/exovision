import time
from typing import Any, Callable, TypeVar, Dict, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from utilities.logger import logger
from routes.auth.auth import router as auth_router
from utilities.db import init_models, async_session

description = """
ExoVision API
"""

log = logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:

    log.info("Starting ExoVision API...")
    await init_models()
    log.info("Startup complete.")

    yield

    log.info("Shutting down ExoVision API...")
    await async_session().close_all()
    log.info("Shutdown complete.")


app = FastAPI(
    title="ExoVision API",
    description=description,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    root_path=settings.root_path,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)

app.include_router(auth_router)


@app.get("/", tags=["Health"])
async def health_check() -> Dict[str, str]:
    return {"status": "ok", "message": "ExoVision API is running"}


F = TypeVar("F", bound=Callable[..., Any])


@app.middleware("http")
async def process_time_log_middleware(
    request: Request, call_next: Callable[[Request], Any]
) -> Response:
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = str(round(time.time() - start_time, 3))
    response.headers["X-Process-Time"] = process_time
    log.info(
        "Method=%s Path=%s StatusCode=%s ProcessTime=%s",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )
    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
