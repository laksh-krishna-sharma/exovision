import time
from typing import Any, Callable, TypeVar, Dict, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utilities.logger import logger
from app.routes.auth.auth import router as auth_router
from app.routes.prediction.prediction import router as prediction_router
from app.utilities.db import init_models, async_session

description = """
ExoVision API
"""

log = logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:

    log.info("Starting ExoVision API...")
    await init_models()

    # Preload the K2 Keppler prediction model
    try:
        from app.services.prediction import prediction_service

        prediction_service.load_model()
        log.info("K2 Keppler prediction model loaded successfully during startup")
    except Exception as e:
        log.error(f"Failed to load K2 Keppler prediction model during startup: {e}")

    # Preload the TESS prediction model
    try:
        from app.services.prediction import tess_prediction_service

        tess_prediction_service.load_model()
        log.info("TESS prediction model loaded successfully during startup")
    except Exception as e:
        log.error(f"Failed to load TESS prediction model during startup: {e}")

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
app.include_router(prediction_router)


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
