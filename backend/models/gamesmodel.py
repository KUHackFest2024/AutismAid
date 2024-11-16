from sqlalchemy import (
    Column,
    String,
    Integer,
)
import datetime
# from ..database.configuration import Base
from database.configuration import Base

class Game(Base):
    __tablename__="games_table"
    id = Column(Integer,primary_key=True,autoincrement=True)
    tag = Column(String(10))
    attentive = Column(Integer)
    distracted = Column(Integer)
    correct = Column(Integer)
    incorrect = Column(Integer)
    happy = Column(Integer)
    sad = Column(Integer)
    angry = Column(Integer)
    disgusted = Column(Integer)
    fear = Column(Integer)
    sad = Column(Integer)
    surprise = Column(Integer)
    neutral = Column(Integer)



