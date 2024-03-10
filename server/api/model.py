from ctypes import Union
import os
from fastapi.routing import APIRouter
from api.preprocess import preprocess
from api.features import process_input
import xgboost as xgb
import lightgbm as lgb
from pydantic import BaseModel
from fastapi import HTTPException, status

router = APIRouter()


class PredictRequest(BaseModel):
    lyric: str


class Label(BaseModel):
    sadness: float
    anger: float
    fear: float
    happy: float


class PredictResponse(BaseModel):
    XGB: Label
    LGBM: Label


CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))

xgb_model = xgb.Booster(model_file=f"{CURRENT_PATH}/model/xgb_model.model")
# lgb_model = lgb.Booster(model_file=f"{CURRENT_PATH}/model/lgb_model.txt")


@router.post("/predict", response_model=PredictResponse, status_code=status.HTTP_200_OK)
def predict(
    request: PredictRequest,
):
    try:
        cleaned_text = preprocess(request.lyric)
    except:
        print("error preprocess")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error with data cleaning",
        )
    try:
        features = process_input(cleaned_text)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error with feature extraction, please check your input",
        )

    conventional_features = features.drop(["text", "token"], axis=1)

    conventional_features_dmatrix = xgb.DMatrix(conventional_features)
    xgb_result = xgb_model.predict(conventional_features_dmatrix)
    # lgb_result = lgb_model.predict(conventional_features)

    # return in json format
    xgb_result = xgb_result.tolist()[0]
    # lgb_result = lgb_result.tolist()[0]
    return PredictResponse(
        XGB={
            "sadness": xgb_result[0],
            "anger": xgb_result[1],
            "fear": xgb_result[2],
            "happy": xgb_result[3],
        },
        LGBM={
            "sadness": xgb_result[0],
            "anger": xgb_result[1],
            "fear": xgb_result[2],
            "happy": xgb_result[3],
        },
    )
