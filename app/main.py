from datetime import date, datetime
from decimal import Decimal
import os
import time
from enum import Enum
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, Numeric, String, create_engine, desc, select
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:passer0412@db:5432/even_221")


class Base(DeclarativeBase):
    pass


class TypeEspace(str, Enum):
    SALLE_DE_CONFERENCE = "SALLE_DE_CONFERENCE"
    JARDIN = "JARDIN"
    ROOFTOP = "ROOFTOP"
    SALLE_DE_FETE = "SALLE_DE_FETE"


class TypePrestataire(str, Enum):
    TRAITEUR = "TRAITEUR"
    DJ = "DJ"
    PHOTOGRAPHE = "PHOTOGRAPHE"
    DECORATEUR = "DECORATEUR"


class TypeClient(str, Enum):
    PARTICULIER = "PARTICULIER"
    ENTREPRISE = "ENTREPRISE"


class StatutReservation(str, Enum):
    CONFIRMEE = "CONFIRMEE"
    ANNULEE = "ANNULEE"
    TERMINEE = "TERMINEE"


class Espace(Base):
    __tablename__ = "espaces"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    nom: Mapped[str] = mapped_column(String, nullable=False)
    capaciteMax: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[TypeEspace] = mapped_column(
        SqlEnum(TypeEspace, name="TypeEspace", create_type=False), nullable=False
    )
    prixParJour: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    reservations: Mapped[list["Reservation"]] = relationship(back_populates="espace")


class Prestataire(Base):
    __tablename__ = "prestataires"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[TypePrestataire] = mapped_column(
        SqlEnum(TypePrestataire, name="TypePrestataire", create_type=False), nullable=False
    )
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    telephone: Mapped[str] = mapped_column(String, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    reservations: Mapped[list["Reservation"]] = relationship(back_populates="prestataire")


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prenom: Mapped[str] = mapped_column(String, nullable=False)
    nom: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    telephone: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[TypeClient] = mapped_column(
        SqlEnum(TypeClient, name="TypeClient", create_type=False), nullable=False
    )
    createdAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    reservations: Mapped[list["Reservation"]] = relationship(back_populates="client")


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clientId: Mapped[int] = mapped_column(ForeignKey("clients.id"), nullable=False)
    espaceId: Mapped[int] = mapped_column(ForeignKey("espaces.id"), nullable=False)
    prestataireId: Mapped[Optional[int]] = mapped_column(ForeignKey("prestataires.id"), nullable=True)
    dateEvenement: Mapped[date] = mapped_column(Date, nullable=False)
    nombreInvites: Mapped[int] = mapped_column(Integer, nullable=False)
    montantTotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    statut: Mapped[StatutReservation] = mapped_column(
        SqlEnum(StatutReservation, name="StatutReservation", create_type=False), nullable=False
    )
    createdAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    client: Mapped[Client] = relationship(back_populates="reservations")
    espace: Mapped[Espace] = relationship(back_populates="reservations")
    prestataire: Mapped[Optional[Prestataire]] = relationship(back_populates="reservations")


engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class ApiModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


class ClientCreate(ApiModel):
    prenom: str = Field(min_length=1)
    nom: str = Field(min_length=1)
    email: EmailStr
    telephone: str = Field(min_length=1)
    type: TypeClient


class EspaceCreate(ApiModel):
    code: str = Field(min_length=1)
    nom: str = Field(min_length=1)
    capaciteMax: int = Field(gt=0)
    type: TypeEspace
    prixParJour: Decimal = Field(gt=0)


class PrestataireCreate(ApiModel):
    nom: str = Field(min_length=1)
    type: TypePrestataire
    email: EmailStr
    telephone: str = Field(min_length=1)


class ReservationCreate(ApiModel):
    clientId: int = Field(gt=0)
    espaceId: int = Field(gt=0)
    prestataireId: Optional[int] = Field(default=None, gt=0)
    dateEvenement: date
    nombreInvites: int = Field(gt=0)


class ClientOut(ApiModel):
    id: int
    prenom: str
    nom: str
    email: str
    telephone: str
    type: TypeClient
    createdAt: datetime
    updatedAt: datetime


class EspaceOut(ApiModel):
    id: int
    code: str
    nom: str
    capaciteMax: int
    type: TypeEspace
    prixParJour: Decimal
    createdAt: datetime
    updatedAt: datetime


class PrestataireOut(ApiModel):
    id: int
    nom: str
    type: TypePrestataire
    email: str
    telephone: str
    createdAt: datetime
    updatedAt: datetime


class ReservationOut(ApiModel):
    id: int
    clientId: int
    espaceId: int
    prestataireId: Optional[int]
    dateEvenement: date
    nombreInvites: int
    montantTotal: Decimal
    statut: StatutReservation
    createdAt: datetime
    updatedAt: datetime
    client: ClientOut
    espace: EspaceOut
    prestataire: Optional[PrestataireOut]


def api_success(data, message: str, status_code: int = status.HTTP_200_OK) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "message": message, "data": data},
    )


def api_error(message: str, status_code: int, errors=None) -> JSONResponse:
    payload = {"success": False, "message": message}
    if errors is not None:
        payload["errors"] = errors
    return JSONResponse(status_code=status_code, content=payload)


def serialize_model(schema: type[ApiModel], instance):
    return schema.model_validate(instance).model_dump(mode="json")


def serialize_list(schema: type[ApiModel], instances):
    return [serialize_model(schema, item) for item in instances]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI(
    title="EVENT 221 API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)


@app.on_event("startup")
def wait_for_database():
    for attempt in range(20):
        try:
            with engine.connect() as connection:
                connection.execute(select(1))
            return
        except OperationalError:
            if attempt == 19:
                raise
            time.sleep(2)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    detail = exc.detail if isinstance(exc.detail, dict) else {"message": exc.detail}
    return api_error(
        message=detail.get("message", "Une erreur est survenue."),
        status_code=exc.status_code,
        errors=detail.get("errors"),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    errors = [
        {"field": ".".join(str(part) for part in error["loc"][1:]), "message": error["msg"]}
        for error in exc.errors()
    ]
    return api_error("Données invalides.", status.HTTP_422_UNPROCESSABLE_ENTITY, errors)


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return api_error(f"Erreur interne du serveur: {exc}", status.HTTP_500_INTERNAL_SERVER_ERROR)


@app.get("/api-docs", include_in_schema=False)
def api_docs_redirect():
    return RedirectResponse(url="/docs")


@app.get("/api-docs/swagger.json", include_in_schema=False)
def api_docs_schema():
    return RedirectResponse(url="/openapi.json")


@app.get("/health")
def health():
    return {"status": "OK", "app": "EVENT 221 API"}


@app.get("/api/v1/clients")
def get_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).order_by(desc(Client.createdAt)).all()
    return api_success(serialize_list(ClientOut, clients), "Liste des clients récupérée.")


@app.get("/api/v1/clients/{client_id}")
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail={"message": "Client introuvable."})
    return api_success(serialize_model(ClientOut, client), "Client récupéré.")


@app.post("/api/v1/clients", status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    existing = db.query(Client).filter(Client.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"message": f"Un client avec l'email '{payload.email}' existe déjà."},
        )

    now = datetime.utcnow()
    client = Client(**payload.model_dump(), createdAt=now, updatedAt=now)
    db.add(client)
    db.commit()
    db.refresh(client)
    return api_success(serialize_model(ClientOut, client), "Client créé avec succès.", 201)


@app.delete("/api/v1/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail={"message": "Client introuvable."})

    has_reservations = db.query(Reservation.id).filter(Reservation.clientId == client_id).first()
    if has_reservations:
        raise HTTPException(
            status_code=409,
            detail={"message": "Impossible de supprimer ce client : il possède des réservations existantes."},
        )

    db.delete(client)
    db.commit()
    return api_success(None, "Client supprimé avec succès.")


@app.get("/api/v1/espaces")
def get_espaces(db: Session = Depends(get_db)):
    espaces = db.query(Espace).order_by(desc(Espace.createdAt)).all()
    return api_success(serialize_list(EspaceOut, espaces), "Liste des espaces récupérée.")


@app.get("/api/v1/espaces/{espace_id}")
def get_espace(espace_id: int, db: Session = Depends(get_db)):
    espace = db.get(Espace, espace_id)
    if not espace:
        raise HTTPException(status_code=404, detail={"message": "Espace introuvable."})
    return api_success(serialize_model(EspaceOut, espace), "Espace récupéré.")


@app.post("/api/v1/espaces", status_code=status.HTTP_201_CREATED)
def create_espace(payload: EspaceCreate, db: Session = Depends(get_db)):
    existing = db.query(Espace).filter(Espace.code == payload.code).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"message": f"Un espace avec le code '{payload.code}' existe déjà."},
        )

    now = datetime.utcnow()
    espace = Espace(**payload.model_dump(), createdAt=now, updatedAt=now)
    db.add(espace)
    db.commit()
    db.refresh(espace)
    return api_success(serialize_model(EspaceOut, espace), "Espace créé avec succès.", 201)


@app.delete("/api/v1/espaces/{espace_id}")
def delete_espace(espace_id: int, db: Session = Depends(get_db)):
    espace = db.get(Espace, espace_id)
    if not espace:
        raise HTTPException(status_code=404, detail={"message": "Espace introuvable."})

    has_confirmed_reservation = (
        db.query(Reservation.id)
        .filter(
            Reservation.espaceId == espace_id,
            Reservation.statut == StatutReservation.CONFIRMEE,
        )
        .first()
    )
    if has_confirmed_reservation:
        raise HTTPException(
            status_code=409,
            detail={"message": "Impossible de supprimer cet espace : il possède des réservations CONFIRMEE en cours."},
        )

    db.delete(espace)
    db.commit()
    return api_success(None, "Espace supprimé avec succès.")


@app.get("/api/v1/prestataires")
def get_prestataires(db: Session = Depends(get_db)):
    prestataires = db.query(Prestataire).order_by(desc(Prestataire.createdAt)).all()
    return api_success(serialize_list(PrestataireOut, prestataires), "Liste des prestataires récupérée.")


@app.get("/api/v1/prestataires/{prestataire_id}")
def get_prestataire(prestataire_id: int, db: Session = Depends(get_db)):
    prestataire = db.get(Prestataire, prestataire_id)
    if not prestataire:
        raise HTTPException(status_code=404, detail={"message": "Prestataire introuvable."})
    return api_success(serialize_model(PrestataireOut, prestataire), "Prestataire récupéré.")


@app.post("/api/v1/prestataires", status_code=status.HTTP_201_CREATED)
def create_prestataire(payload: PrestataireCreate, db: Session = Depends(get_db)):
    existing = db.query(Prestataire).filter(Prestataire.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"message": f"Un prestataire avec l'email '{payload.email}' existe déjà."},
        )

    now = datetime.utcnow()
    prestataire = Prestataire(**payload.model_dump(), createdAt=now, updatedAt=now)
    db.add(prestataire)
    db.commit()
    db.refresh(prestataire)
    return api_success(serialize_model(PrestataireOut, prestataire), "Prestataire créé avec succès.", 201)


@app.delete("/api/v1/prestataires/{prestataire_id}")
def delete_prestataire(prestataire_id: int, db: Session = Depends(get_db)):
    prestataire = db.get(Prestataire, prestataire_id)
    if not prestataire:
        raise HTTPException(status_code=404, detail={"message": "Prestataire introuvable."})

    has_reservations = (
        db.query(Reservation.id).filter(Reservation.prestataireId == prestataire_id).first()
    )
    if has_reservations:
        raise HTTPException(
            status_code=409,
            detail={"message": "Impossible de supprimer ce prestataire : il est lié à des réservations existantes."},
        )

    db.delete(prestataire)
    db.commit()
    return api_success(None, "Prestataire supprimé avec succès.")


def get_reservation_or_404(db: Session, reservation_id: int) -> Reservation:
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail={"message": "Réservation introuvable."})
    return reservation


@app.get("/api/v1/reservations")
def get_reservations(db: Session = Depends(get_db)):
    reservations = db.query(Reservation).order_by(Reservation.dateEvenement.asc()).all()
    return api_success(serialize_list(ReservationOut, reservations), "Liste des réservations récupérée.")


@app.get("/api/v1/reservations/{reservation_id}")
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = get_reservation_or_404(db, reservation_id)
    return api_success(serialize_model(ReservationOut, reservation), "Réservation récupérée.")


@app.post("/api/v1/reservations", status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    client = db.get(Client, payload.clientId)
    if not client:
        raise HTTPException(status_code=404, detail={"message": "Client introuvable."})

    espace = db.get(Espace, payload.espaceId)
    if not espace:
        raise HTTPException(status_code=404, detail={"message": "Espace introuvable."})

    if payload.prestataireId is not None:
        prestataire = db.get(Prestataire, payload.prestataireId)
        if not prestataire:
            raise HTTPException(status_code=404, detail={"message": "Prestataire introuvable."})

    if payload.dateEvenement < date.today():
        raise HTTPException(
            status_code=422,
            detail={"message": "La date de l'événement doit être égale ou postérieure à aujourd'hui."},
        )

    if payload.nombreInvites > espace.capaciteMax:
        raise HTTPException(
            status_code=422,
            detail={
                "message": (
                    f"Le nombre d'invités ({payload.nombreInvites}) dépasse la capacité max "
                    f"de l'espace ({espace.capaciteMax})."
                )
            },
        )

    conflicting_reservation = (
        db.query(Reservation.id)
        .filter(
            Reservation.espaceId == payload.espaceId,
            Reservation.dateEvenement == payload.dateEvenement,
            Reservation.statut == StatutReservation.CONFIRMEE,
        )
        .first()
    )
    if conflicting_reservation:
        raise HTTPException(
            status_code=409,
            detail={
                "message": (
                    f"L'espace '{espace.nom}' est déjà réservé (CONFIRMEE) "
                    f"à la date du {payload.dateEvenement.strftime('%d/%m/%Y')}."
                )
            },
        )

    now = datetime.utcnow()
    reservation = Reservation(
        **payload.model_dump(),
        montantTotal=espace.prixParJour,
        statut=StatutReservation.CONFIRMEE,
        createdAt=now,
        updatedAt=now,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return api_success(serialize_model(ReservationOut, reservation), "Réservation créée avec succès.", 201)


@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"], include_in_schema=False)
def not_found(full_path: str):
    raise HTTPException(status_code=404, detail={"message": f"Route '/{full_path}' introuvable."})
