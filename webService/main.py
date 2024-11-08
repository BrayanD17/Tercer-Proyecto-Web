import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, DECIMAL, ForeignKey, Enum,func

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import csv
from pydantic import BaseModel, EmailStr, validator, ConfigDict
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from typing import Optional, List
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
# Configuración de SQLite
DATABASE_URL = "sqlite:///./fitness_app.db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Configurar la sesión con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear una instancia de CryptContext para el manejo de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Configuración del token
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Modelo de la base de datos
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    birthday = Column(DateTime, nullable=False)
    gender = Column(Enum('Masculino', 'Femenino'), nullable=False)
    current_weight = Column(Float, nullable=False)  
    current_height = Column(Float, nullable=False)

    weights = relationship("Weight", back_populates="user")
    heights = relationship("Height", back_populates="user")
    body_fat_percentages = relationship("BodyFatPercentage", back_populates="user")
    body_compositions = relationship("BodyComposition", back_populates="user")
    water_consumptions = relationship("WaterConsumption", back_populates="user")
    daily_steps = relationship("DailySteps", back_populates="user")
    exercises = relationship("Exercise", back_populates="user")

class Weight(Base):
    __tablename__ = "weights"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    weight = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="weights")

class Height(Base):
    __tablename__ = "heights"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    height = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="heights")

class BodyFatPercentage(Base):
    __tablename__ = "body_fat_percentages"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)  # Usa datetime.utcnow
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat_percentage = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="body_fat_percentages")

class BodyComposition(Base):
    __tablename__ = "body_compositions"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)  # Usa datetime.utcnow
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat = Column(DECIMAL(5, 2))
    muscle = Column(DECIMAL(5, 2))
    water = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="body_compositions")

class WaterConsumption(Base):
    __tablename__ = "water_consumptions"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)  # Usa datetime.utcnow
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    water_amount = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="water_consumptions")

class DailySteps(Base):
    __tablename__ = "daily_steps"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)  # Usa datetime.utcnow
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    steps_amount = Column(Integer)
    user = relationship("User", back_populates="daily_steps")

class Exercise(Base):
    __tablename__ = "exercises"
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)  # Usa datetime.utcnow
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    exercise_name = Column(String)
    duration = Column(Integer)
    user = relationship("User", back_populates="exercises")
    
# Crear las tablas
Base.metadata.create_all(bind=engine)

# Modelo de solicitud
class RegisterUserRequest(BaseModel):
    email: str
    username: str
    password: str
    birthday: datetime
    gender: str
    current_weight: float
    current_height: float

class LoginRequest(BaseModel):
    username: str
    password: str

class UserProfileResponse(BaseModel):
    email: str
    username: str
    birthday: datetime
    gender: str
    current_weight: float
    current_height: float

class UserProfileResponse(BaseModel):
    email: str
    username: str
    birthday: datetime
    gender: str
    current_weight: float
    current_height: float

class UserUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    birthday: Optional[datetime] = None 
    gender: Optional[str] = None
    current_weight: Optional[float] = None
    current_height: Optional[float] = None

    @validator("current_weight", "current_height")
    def validate_positive(cls, value):
        if value is not None and value <= 0:
            raise ValueError("Los valores de peso y altura deben ser positivos.")
        return value

class PasswordChangeRequest(BaseModel):
    username: str
    current_password: str
    new_password: str
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")

# Función para obtener el usuario actual a partir del token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


# Endpoints
@app.post("/register/")
async def register_user(user: RegisterUserRequest, db: Session = Depends(get_db)):
    # Cifrar la contraseña
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        password=hashed_password,
        birthday=user.birthday,
        gender=user.gender,
        current_weight=user.current_weight,
        current_height=user.current_height
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Usuario registrado con éxito"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado")

@app.get("/users/", response_model=List[str])
async def get_all_usernames(db: Session = Depends(get_db)):
    users = db.query(User.username).all()
    return [user[0] for user in users]  # Retorna solo los nombres de usuario

@app.post("/login/")
async def login(user: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id} 

@app.post("/logout/")
async def logout():
    return {"message": "Sesión cerrada con éxito"}

@app.get("/user/{username}", response_model=UserProfileResponse)
async def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.post("/user/{username}/update-field")
async def update_user_field(
    username: str,
    update_data: UserUpdateRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if update_data.birthday:
        if isinstance(update_data.birthday, str):
            try:
                update_data.birthday = datetime.fromisoformat(update_data.birthday)
            except ValueError:
                raise HTTPException(status_code=422, detail="Formato de fecha incorrecto, esperado YYYY-MM-DDTHH:MM:SS")
        user.birthday = update_data.birthday

    if update_data.email:
        user.email = update_data.email
    if update_data.username:
        existing_user = db.query(User).filter(User.username == update_data.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        user.username = update_data.username
    if update_data.gender:
        user.gender = update_data.gender
    if update_data.current_weight is not None:
        user.current_weight = update_data.current_weight
    if update_data.current_height is not None:
        user.current_height = update_data.current_height

    try:
        db.commit()
        db.refresh(user)
        return {"message": "Campo actualizado con éxito", "updated_user": user}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el perfil")
    
@app.post("/user/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    db: Session = Depends(get_db)
):
    print("Iniciando el cambio de contraseña")
    print("Datos recibidos para cambiar contraseña:", password_data)
    
    # Buscar al usuario por el nombre de usuario
    user = db.query(User).filter(User.username == password_data.username).first()
    print("Usuario encontrado:", user.username if user else "No encontrado")
    
    # Verificar si el usuario existe
    if not user:
        print("Usuario no encontrado")
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar si la contraseña actual es correcta
    if not pwd_context.verify(password_data.current_password, user.password):
        print("Contraseña actual incorrecta")
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
    
    # Validar la nueva contraseña
    if len(password_data.new_password) < 10 or not any(c.isalpha() for c in password_data.new_password) or \
        not any(c.isdigit() for c in password_data.new_password) or not any(c in '!@#$%^&*(),.?":{}|<>' for c in password_data.new_password):
        print("Validación de nueva contraseña fallida")
        raise HTTPException(
            status_code=400, 
            detail="La nueva contraseña debe tener al menos 10 caracteres, incluir letras, números y al menos un símbolo."
        )
    
    # Cifrar la nueva contraseña y actualizarla en la base de datos
    hashed_new_password = pwd_context.hash(password_data.new_password)
    user.password = hashed_new_password
    db.commit()
    db.refresh(user)
    print("Contraseña actualizada exitosamente")
    return {"message": "Contraseña actualizada exitosamente"}

# Servicio para importar datos de sensores
@app.post("/importar_sensores/")
async def importar_sensores(
    tipo_dato: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Obtiene el usuario autenticado
):
    user_id = current_user.id  # ID del usuario autenticado

    try:
        # Leer el archivo CSV
        contenido = await archivo.read()
        archivo_csv = io.StringIO(contenido.decode("utf-8"))
        lector = csv.reader(archivo_csv)
        next(lector)  # Saltar la primera línea del archivo CSV

        # Validación del tipo de dato
        if tipo_dato == "pesos":
            for fila in lector:
                fecha, peso = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                peso = float(peso)
                nuevo_peso = Weight(date=fecha, weight=peso, userId=user_id) 
                actualizar_o_insertar(db, Weight, nuevo_peso)

        elif tipo_dato == "alturas":
            for fila in lector:
                fecha, altura = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                altura = float(altura)
                nueva_altura = Height(date=fecha, height=altura, userId=user_id)
                actualizar_o_insertar(db, Height, nueva_altura)

        elif tipo_dato == "composicion_corporal":
            for fila in lector:
                fecha, grasa, musculo, agua = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                grasa = float(grasa)
                musculo = float(musculo)
                agua = float(agua)
                nueva_composicion = BodyComposition(date=fecha, fat=grasa, muscle=musculo, water=agua, userId=user_id)
                actualizar_o_insertar(db, BodyComposition, nueva_composicion)

        elif tipo_dato == "porcentaje_grasa":
            for fila in lector:
                fecha, porcentaje_grasa = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                porcentaje_grasa = float(porcentaje_grasa)
                nuevo_porcentaje_grasa = BodyFatPercentage(date=fecha, fat_percentage=porcentaje_grasa,userId=user_id)
                actualizar_o_insertar(db, BodyFatPercentage, nuevo_porcentaje_grasa)
        elif tipo_dato == "vasos_de_agua":
            for fila in lector:
                fecha, vasos_agua = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()  # Usar la fecha del archivo
                vasos_agua = int(vasos_agua)
                nuevo_consumo_agua = WaterConsumption(date=fecha, water_amount=vasos_agua, userId=user_id)
                actualizar_o_insertar(db, WaterConsumption, nuevo_consumo_agua)

        elif tipo_dato == "pasos_diarios":
            for fila in lector:
                fecha, cantidad_pasos = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()  # Usar la fecha del archivo
                cantidad_pasos = int(cantidad_pasos)
                nuevos_pasos = DailySteps(date=fecha, steps_amount=cantidad_pasos, userId=user_id)
                actualizar_o_insertar(db, DailySteps, nuevos_pasos)

        elif tipo_dato == "ejercicios":
            for fila in lector:
                fecha, nombre_ejercicio, duracion = fila
                fecha = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                duracion = int(duracion)
                nuevo_ejercicio = Exercise(date=fecha, exercise_name=nombre_ejercicio, duration=duracion, userId=user_id)
                actualizar_o_insertar(db, Exercise, nuevo_ejercicio)

        else:
            raise HTTPException(status_code=400, detail="Tipo de dato no soportado")

        db.commit()
        return {"mensaje": "Datos importados con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al importar datos: {e}")

# Configuración del token
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para actualizar o insertar un registro si existe o no
def actualizar_o_insertar(db: Session, modelo, nuevo_registro):
    existente = db.query(modelo).filter_by(date=nuevo_registro.date, userId=nuevo_registro.userId).first()
    if existente:
        # Si ya existe un registro con la misma fecha, lo actualizamos
        for key, value in nuevo_registro.__dict__.items():
            setattr(existente, key, value)
    else:
        # Si no existe, lo insertamos
        db.add(nuevo_registro)


@app.get("/user/data/", response_model=dict)
async def get_user_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    today = date.today()
    
    # Obtener los datos más recientes o de hoy para cada tabla
    weights = db.query(Weight).filter(Weight.userId == user_id).order_by(
        Weight.date.desc()).first()
    
    heights = db.query(Height).filter(Height.userId == user_id).order_by(
        Height.date.desc()).first()
    
    body_fat_percentage = db.query(BodyFatPercentage).filter(BodyFatPercentage.userId == user_id).order_by(
        BodyFatPercentage.date.desc()).first()
    
    body_composition = db.query(BodyComposition).filter(BodyComposition.userId == user_id).order_by(
        BodyComposition.date.desc()).first()
    
    water_consumption = db.query(WaterConsumption).filter(WaterConsumption.userId == user_id).order_by(
        WaterConsumption.date.desc()).first()
    
    daily_steps = db.query(DailySteps).filter(DailySteps.userId == user_id).order_by(
        DailySteps.date.desc()).first()
    
    # Obtener la fecha más reciente de ejercicios
    most_recent_exercise_date = db.query(Exercise.date).filter(Exercise.userId == user_id).order_by(
        Exercise.date.desc()).first()
    
    # Obtener todos los ejercicios realizados en la fecha más reciente
    exercises = []
    if most_recent_exercise_date:
        exercises = db.query(Exercise).filter(
            Exercise.userId == user_id,
            Exercise.date == most_recent_exercise_date.date  # Solo ejercicios de la fecha más reciente
        ).all()
    
    # Si no hay datos de peso o altura, buscar en la tabla User
    weight_value = weights.weight if weights else current_user.current_weight
    height_value = heights.height if heights else current_user.current_height
    
    # Estructurar la respuesta con los datos encontrados
    response = {
        "weight": weight_value,
        "height": height_value,
        "body_fat_percentage": body_fat_percentage.fat_percentage if body_fat_percentage else None,
        "body_composition": {
            "fat": body_composition.fat if body_composition else None,
            "muscle": body_composition.muscle if body_composition else None,
            "water": body_composition.water if body_composition else None,
        },
        "water_consumption": water_consumption.water_amount if water_consumption else None,
        "daily_steps": daily_steps.steps_amount if daily_steps else None,
        "exercises": [
            {"name": exercise.exercise_name, "duration": exercise.duration} for exercise in exercises
        ]
    }
    
    return response