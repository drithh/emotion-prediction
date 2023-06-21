from ctypes import Union
from fastapi.routing import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
    return {"Hello": "World"}
