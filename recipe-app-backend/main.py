# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from routes.ingredients import router as ingredients_router
from routes.recipes import router as recipes_router
from routes.meal_plan import router as meal_plan_router
from routes.agent import router as agent_router
from routes.user_input import router as users_router

app = FastAPI(
    title="Recipe Recommender API",
    description="API for smart recipe recommender and meal planner",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(ingredients_router, prefix="/api", tags=["Ingredients"])
app.include_router(recipes_router, prefix="/api", tags=["Recipes"])
app.include_router(meal_plan_router, prefix="/api", tags=["Meal Plan"])
app.include_router(agent_router, prefix="/api", tags=["Recipe Agent"])

app.include_router(users_router, prefix="/api", tags=["Users"])


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Recipe Recommender API",
        version="1.0.0",
        description="This API provides endpoints for a smart recipe recommender and meal planner.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
