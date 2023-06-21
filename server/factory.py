from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware

from config import settings


def create_app():
    description = f"{settings.PROJECT_NAME} API"
    app = FastAPI(
        title=settings.PROJECT_NAME,
        servers=[{"url": settings.REACT_APP_BACKEND_URL}],
        openapi_url=f"{settings.API_PATH}/openapi.json",
        docs_url="/swagger",
        description=description,
        version=settings.VERSION,
        redoc_url="/redoc",
    )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc):
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        if hasattr(exc, "detail"):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": exc.detail},
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": exc.errors()},
            )

    setup_gzip_middleware(app)
    setup_router(app)
    setup_cors_middleware(app)

    return app


def setup_gzip_middleware(app):
    app.add_middleware(GZipMiddleware, minimum_size=500)


from api.model import router as model_router


def setup_router(app):
    app.include_router(model_router, prefix=settings.API_PATH, tags=["Model"])


def setup_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        expose_headers=["Content-Range", "Range"],
        allow_headers=["Authorization", "Range", "Content-Range"],
    )
