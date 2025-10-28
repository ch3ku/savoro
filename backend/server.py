from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import io
import qrcode
import google.generativeai as genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
text_model = genai.GenerativeModel("gemini-1.5-flash")
image_model = genai.GenerativeModel("imagen-3.0")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Menu Models
class MenuCreate(BaseModel):
    cafe_name: str
    cafe_description: Optional[str] = ""
    theme_color: Optional[str] = "#FF6B6B"

class Menu(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cafe_name: str
    cafe_description: str
    theme_color: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Dish Models
class DishCreate(BaseModel):
    menu_id: str
    name: str
    description: Optional[str] = ""
    price: float
    category: str
    image_url: Optional[str] = ""

class DishUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

class Dish(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    menu_id: str
    name: str
    description: str
    price: float
    category: str
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# AI Generation Models
class GenerateDescriptionRequest(BaseModel):
    dish_name: str
    category: str

class GenerateImageRequest(BaseModel):
    dish_name: str
    description: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "SavoroAI API (Gemini powered)"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Menu Endpoints
@api_router.post("/menus", response_model=Menu)
async def create_menu(menu_input: MenuCreate):
    menu_dict = menu_input.model_dump()
    menu_obj = Menu(**menu_dict)
    doc = menu_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.menus.insert_one(doc)
    return menu_obj

@api_router.get("/menus/{menu_id}", response_model=Menu)
async def get_menu(menu_id: str):
    menu = await db.menus.find_one({"id": menu_id}, {"_id": 0})
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    if isinstance(menu['created_at'], str):
        menu['created_at'] = datetime.fromisoformat(menu['created_at'])
    return menu

@api_router.get("/menus", response_model=List[Menu])
async def get_all_menus():
    menus = await db.menus.find({}, {"_id": 0}).to_list(1000)
    for menu in menus:
        if isinstance(menu['created_at'], str):
            menu['created_at'] = datetime.fromisoformat(menu['created_at'])
    return menus

# Dish Endpoints
@api_router.post("/dishes", response_model=Dish)
async def create_dish(dish_input: DishCreate):
    dish_dict = dish_input.model_dump()
    dish_obj = Dish(**dish_dict)
    doc = dish_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.dishes.insert_one(doc)
    return dish_obj

@api_router.get("/dishes/{menu_id}", response_model=List[Dish])
async def get_dishes_by_menu(menu_id: str):
    dishes = await db.dishes.find({"menu_id": menu_id}, {"_id": 0}).to_list(1000)
    for dish in dishes:
        if isinstance(dish['created_at'], str):
            dish['created_at'] = datetime.fromisoformat(dish['created_at'])
    return dishes

@api_router.put("/dishes/{dish_id}", response_model=Dish)
async def update_dish(dish_id: str, dish_update: DishUpdate):
    existing_dish = await db.dishes.find_one({"id": dish_id}, {"_id": 0})
    if not existing_dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    update_data = dish_update.model_dump(exclude_unset=True)
    if update_data:
        await db.dishes.update_one({"id": dish_id}, {"$set": update_data})
        existing_dish.update(update_data)

    if isinstance(existing_dish['created_at'], str):
        existing_dish['created_at'] = datetime.fromisoformat(existing_dish['created_at'])
    return Dish(**existing_dish)

@api_router.delete("/dishes/{dish_id}")
async def delete_dish(dish_id: str):
    result = await db.dishes.delete_one({"id": dish_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {"message": "Dish deleted successfully"}

# AI Generation Endpoints
@api_router.post("/generate-description")
async def generate_description(request: GenerateDescriptionRequest):
    try:
        prompt = f"Write a short, appealing menu description (2-3 sentences) for a dish named '{request.dish_name}' in the category '{request.category}'. Make it sound mouthwatering and creative."
        response = text_model.generate_content(prompt)
        return {"description": response.text.strip()}
    except Exception as e:
        logging.error(f"Error generating description: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate description: {str(e)}")

@api_router.post("/generate-image")
async def generate_image(request: GenerateImageRequest):
    try:
        prompt = f"Create a professional, high-quality photo of {request.dish_name}. {request.description}. The image should look like perfect food photography with great lighting and presentation."
        result = image_model.generate_content([prompt], generation_config={"response_mime_type": "image/png"})
        image_base64 = base64.b64encode(result._result.candidates[0].content.parts[0].inline_data.data).decode()
        return {"image_url": f"data:image/png;base64,{image_base64}"}
    except Exception as e:
        logging.error(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

# QR Code Generation
@api_router.get("/qr/{menu_id}")
async def generate_qr_code(menu_id: str):
    try:
        menu = await db.menus.find_one({"id": menu_id}, {"_id": 0})
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        menu_url = f"{frontend_url}/menu/{menu_id}"

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(menu_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.getvalue()).decode()

        return {"qr_code": f"data:image/png;base64,{img_str}", "menu_url": menu_url}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error generating QR code: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate QR code: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
