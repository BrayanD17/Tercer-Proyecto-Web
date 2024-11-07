import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, Float, String, Date, DECIMAL, ForeignKey, Enum,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from fastapi.security import OAuth2PasswordBearer

import datetime
import csv
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import timedelta
from typing import List

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
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + timedelta(minutes=15)
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

    # Relaciones con las otras tablas (las mantenemos igual)
    weights = relationship("Weight", back_populates="user")
    heights = relationship("Height", back_populates="user")
    body_fat_percentages = relationship("BodyFatPercentage", back_populates="user")
    body_compositions = relationship("BodyComposition", back_populates="user")
    water_consumptions = relationship("WaterConsumption", back_populates="user")
    daily_steps = relationship("DailySteps", back_populates="user")
    exercises = relationship("Exercise", back_populates="user")

class Weight(Base):
    __tablename__ = "weights"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    weight = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="weights")

class Height(Base):
    __tablename__ = "heights"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    height = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="heights")

class BodyFatPercentage(Base):
    __tablename__ = "body_fat_percentages"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat_percentage = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="body_fat_percentages")

class BodyComposition(Base):
    __tablename__ = "body_compositions"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat = Column(DECIMAL(5, 2))
    muscle = Column(DECIMAL(5, 2))
    water = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="body_compositions")

class WaterConsumption(Base):
    __tablename__ = "water_consumptions"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    water_amount = Column(DECIMAL(5, 2))
    user = relationship("User", back_populates="water_consumptions")

class DailySteps(Base):
    __tablename__ = "daily_steps"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    steps_amount = Column(Integer)
    user = relationship("User", back_populates="daily_steps")

class Exercise(Base):
    __tablename__ = "exercises"
    date = Column(Date, primary_key=True, default=datetime.date.today)
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
    birthday: datetime.datetime
    gender: str
    current_weight: float
    current_height: float

class LoginRequest(BaseModel):
    username: str
    password: str

class HistoricalDataRequest(BaseModel):
    tipo_dato: str  # Tipo de dato (e.g., 'pesos', 'alturas', etc.)
    periodo_tiempo: str  # Período de tiempo (e.g., '1 semana', '1 mes', etc.)
    
def calcular_rango_fechas(periodo_tiempo: str):
    fecha_actual = datetime.date.today()
    if periodo_tiempo == "1 semana":
        return fecha_actual - timedelta(weeks=1), fecha_actual
    elif periodo_tiempo == "1 mes":
        return fecha_actual - timedelta(days=30), fecha_actual
    elif periodo_tiempo == "3 meses":
        return fecha_actual - timedelta(days=90), fecha_actual
    elif periodo_tiempo == "6 meses":
        return fecha_actual - timedelta(days=180), fecha_actual
    elif periodo_tiempo == "1 año":
        return fecha_actual - timedelta(days=365), fecha_actual
    else:
        raise HTTPException(status_code=400, detail="Período de tiempo no válido")

# Dependencia para obtener el token de autenticación
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Función para obtener el usuario desde el token JWT
def get_user_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=403, detail="No se pudo verificar el usuario")
        return int(user_id)  # Asegúrate de convertir el `user_id` a entero si es necesario
    except JWTError:
        raise HTTPException(status_code=403, detail="No se pudo validar el token")

# Endpoints
@app.post("/register/")
async def register_user(user: RegisterUserRequest, db: Session = Depends(get_db)):
    print("Datos recibidos para registro:", user.dict())  # Verifica los datos recibidos
    
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
        print("Usuario registrado exitosamente:", new_user.id)
        return {"message": "Usuario registrado con éxito"}
    except IntegrityError as e:
        db.rollback()
        print("Error en registro:", e)  # Imprime el error específico
        raise HTTPException(status_code=400, detail="El correo electrónico o nombre de usuario ya está registrado")

@app.get("/users/", response_model=List[str])
async def get_all_usernames(db: Session = Depends(get_db)):
    users = db.query(User.username).all()
    return [user[0] for user in users]  # Retorna solo los nombres de usuario

@app.post("/login/")
async def login(user: LoginRequest, db: Session = Depends(get_db)):
    # Buscar usuario
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # Crear un token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logout/")
async def logout():
    return {"message": "Sesión cerrada con éxito"}

# Servicio para importar datos de sensores
@app.post("/importar_sensores/")
async def importar_sensores(
    tipo_dato: str = Form(...),  # Acepta tipo_dato desde un formulario
    archivo: UploadFile = File(...),  # Recibe archivo como parte de FormData
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_from_token)  
):
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
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                peso = float(peso)
                nuevo_peso = Weight(date=fecha, weight=peso, userId=user_id)  # Ejemplo: asignar el ID de usuario 1
                actualizar_o_insertar(db, Weight, nuevo_peso,)

        elif tipo_dato == "alturas":
            for fila in lector:
                fecha, altura = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                altura = float(altura)
                nueva_altura = Height(date=fecha, height=altura,userId=user_id)
                actualizar_o_insertar(db, Height, nueva_altura)

        elif tipo_dato == "composicion_corporal":
            for fila in lector:
                fecha, grasa, musculo, agua = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                grasa = float(grasa)
                musculo = float(musculo)
                agua = float(agua)
                nueva_composicion = BodyComposition(date=fecha, fat=grasa, muscle=musculo, water=agua,userId=user_id)
                actualizar_o_insertar(db, BodyComposition, nueva_composicion)

        elif tipo_dato == "porcentaje_grasa":
            for fila in lector:
                fecha, porcentaje_grasa = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                porcentaje_grasa = float(porcentaje_grasa)
                nuevo_porcentaje_grasa = BodyFatPercentage(date=fecha, fat_percentage=porcentaje_grasa, userId=user_id)
                actualizar_o_insertar(db, BodyFatPercentage, nuevo_porcentaje_grasa)
        elif tipo_dato == "vasos_de_agua":
            for fila in lector:
                fecha, vasos_agua = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()  # Usar la fecha del archivo
                vasos_agua = int(vasos_agua)
                nuevo_consumo_agua = WaterConsumption(date=fecha, water_amount=vasos_agua, userId=user_id)
                actualizar_o_insertar(db, WaterConsumption, nuevo_consumo_agua)

        elif tipo_dato == "pasos_diarios":
            for fila in lector:
                fecha, cantidad_pasos = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()  # Usar la fecha del archivo
                cantidad_pasos = int(cantidad_pasos)
                nuevos_pasos = DailySteps(date=fecha, steps_amount=cantidad_pasos, userId=user_id)
                actualizar_o_insertar(db, DailySteps, nuevos_pasos)

        elif tipo_dato == "ejercicios":
            for fila in lector:
                fecha, nombre_ejercicio, duracion = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
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
    
    
@app.get("/historico_datos/")
async def cargar_historico_datos(
    tipo_dato: str, periodo_tiempo: str, db: Session = Depends(get_db)
):
    fecha_inicio, fecha_fin = calcular_rango_fechas(periodo_tiempo)
    
    if tipo_dato == "pesos":
        datos = db.query(Weight).filter(
            Weight.date >= fecha_inicio,
            Weight.date <= fecha_fin
        ).all()
        return {"historico_pesos": [dato.weight for dato in datos]}

    elif tipo_dato == "musculo":
        datos = db.query(BodyComposition).filter(
            BodyComposition.date >= fecha_inicio,
            BodyComposition.date <= fecha_fin
        ).all()
        total_musculo = sum(dato.muscle for dato in datos)
        return {"total_musculo": total_musculo}

    elif tipo_dato == "porcentaje_grasa":
        datos = db.query(BodyFatPercentage).filter(
            BodyFatPercentage.date >= fecha_inicio,
            BodyFatPercentage.date <= fecha_fin
        ).all()
        return {"historico_porcentaje_grasa": [dato.fat_percentage for dato in datos]}

    elif tipo_dato == "vasos_de_agua":
        datos = db.query(WaterConsumption).filter(
            WaterConsumption.date >= fecha_inicio,
            WaterConsumption.date <= fecha_fin
        ).all()
        total_vasos = sum(dato.water_amount for dato in datos)
        total_litros = total_vasos * 0.25  # 1 vaso = 250 ml = 0.25 litros
        return {"total_vasos": total_vasos, "total_litros": total_litros}

    elif tipo_dato == "pasos_diarios":
        datos = db.query(DailySteps).filter(
            DailySteps.date >= fecha_inicio,
            DailySteps.date <= fecha_fin
        ).all()
        total_pasos = sum(dato.steps_amount for dato in datos)
        return {"total_pasos": total_pasos}

    elif tipo_dato == "ejercicios":
        datos = db.query(Exercise).filter(
            Exercise.date >= fecha_inicio,
            Exercise.date <= fecha_fin
        ).all()
        total_duracion = sum(dato.duration for dato in datos)
        ejercicios = [{"nombre": dato.exercise_name, "duracion": dato.duration} for dato in datos]
        return {"total_duracion": total_duracion, "ejercicios": ejercicios}

    else:
        raise HTTPException(status_code=400, detail="Tipo de dato no soportado")

# Configuración del token
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def actualizar_o_insertar(db, model, new_object):
    try:
        db.add(new_object)
        db.commit()
        db.refresh(new_object)
    except IntegrityError:
        db.rollback()
        # Aquí podrías actualizar si la entrada ya existe
        db.query(model).filter(model.date == new_object.date, model.userId == new_object.userId).update(new_object.__dict__)
        db.commit()

