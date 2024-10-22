import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, DECIMAL, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import datetime
import csv

app = FastAPI()

# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite solicitudes desde este origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite cualquier método (GET, POST, etc.)
    allow_headers=["*"],  # Permite cualquier encabezado
)

# Configuración de SQLite
DATABASE_URL = "sqlite:///./fitness_app.db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Modelo de la base de datos
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    birthday = Column(Date)
    gender = Column(Enum('Male', 'Female', 'Other'), nullable=False)

    # Relaciones con las otras tablas
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
    
    # Relación con usuario
    user = relationship("User", back_populates="weights")


class Height(Base):
    __tablename__ = "heights"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    height = Column(DECIMAL(5, 2))
    
    # Relación con usuario
    user = relationship("User", back_populates="heights")


class BodyFatPercentage(Base):
    __tablename__ = "body_fat_percentages"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat_percentage = Column(DECIMAL(5, 2))
    
    # Relación con usuario
    user = relationship("User", back_populates="body_fat_percentages")


class BodyComposition(Base):
    __tablename__ = "body_compositions"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    fat = Column(DECIMAL(5, 2))
    muscle = Column(DECIMAL(5, 2))
    water = Column(DECIMAL(5, 2))

    # Relación con usuario
    user = relationship("User", back_populates="body_compositions")


class WaterConsumption(Base):
    __tablename__ = "water_consumptions"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    water_amount = Column(DECIMAL(5, 2))

    # Relación con usuario
    user = relationship("User", back_populates="water_consumptions")


class DailySteps(Base):
    __tablename__ = "daily_steps"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    steps_amount = Column(Integer)

    # Relación con usuario
    user = relationship("User", back_populates="daily_steps")


class Exercise(Base):
    __tablename__ = "exercises"
    date = Column(Date, primary_key=True, default=datetime.date.today)
    userId = Column(Integer, ForeignKey('users.id'), primary_key=True)
    exercise_name = Column(String)
    duration = Column(Integer)  # Duración en minutos

    # Relación con usuario
    user = relationship("User", back_populates="exercises")


# Crear las tablas
Base.metadata.create_all(bind=engine)

# Configurar la sesión con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Obtener la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Servicio para importar datos de sensores
@app.post("/importar_sensores/")
async def importar_sensores(
    tipo_dato: str = Form(...),  # Acepta tipo_dato desde un formulario
    archivo: UploadFile = File(...),  # Recibe archivo como parte de FormData
    db: Session = Depends(get_db)
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
                nuevo_peso = Weight(date=fecha, weight=peso, userId=1)  # Ejemplo: asignar el ID de usuario 1
                actualizar_o_insertar(db, Weight, nuevo_peso)

        elif tipo_dato == "alturas":
            for fila in lector:
                fecha, altura = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                altura = float(altura)
                nueva_altura = Height(date=fecha, height=altura, userId=1)
                actualizar_o_insertar(db, Height, nueva_altura)

        elif tipo_dato == "composicion_corporal":
            for fila in lector:
                fecha, grasa, musculo, agua = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                grasa = float(grasa)
                musculo = float(musculo)
                agua = float(agua)
                nueva_composicion = BodyComposition(date=fecha, fat=grasa, muscle=musculo, water=agua, userId=1)
                actualizar_o_insertar(db, BodyComposition, nueva_composicion)

        elif tipo_dato == "porcentaje_grasa":
            for fila in lector:
                fecha, porcentaje_grasa = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                porcentaje_grasa = float(porcentaje_grasa)
                nuevo_porcentaje_grasa = BodyFatPercentage(date=fecha, fat_percentage=porcentaje_grasa, userId=1)
                actualizar_o_insertar(db, BodyFatPercentage, nuevo_porcentaje_grasa)

        elif tipo_dato == "vasos_de_agua":
            for fila in lector:
                fecha, vasos_agua = fila
                fecha = datetime.datetime.now().date()  # Usar la fecha actual
                vasos_agua = int(vasos_agua)
                nuevo_consumo_agua = WaterConsumption(date=fecha, water_amount=vasos_agua, userId=1)
                actualizar_o_insertar(db, WaterConsumption, nuevo_consumo_agua)

        elif tipo_dato == "pasos_diarios":
            for fila in lector:
                fecha, cantidad_pasos = fila
                fecha = datetime.datetime.now().date()  # Usar la fecha actual
                cantidad_pasos = int(cantidad_pasos)
                nuevos_pasos = DailySteps(date=fecha, steps_amount=cantidad_pasos, userId=1)
                actualizar_o_insertar(db, DailySteps, nuevos_pasos)

        elif tipo_dato == "ejercicios":
            for fila in lector:
                fecha, nombre_ejercicio, duracion = fila
                fecha = datetime.datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S").date()
                duracion = int(duracion)
                nuevo_ejercicio = Exercise(date=fecha, exercise_name=nombre_ejercicio, duration=duracion, userId=1)
                actualizar_o_insertar(db, Exercise, nuevo_ejercicio)

        else:
            raise HTTPException(status_code=400, detail="Tipo de dato no soportado")

        db.commit()
        return {"mensaje": "Datos importados con éxito"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al importar datos: {e}")

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
