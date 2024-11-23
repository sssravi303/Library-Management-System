from flask_security import SQLAlchemySessionUserDatastore
from models import db
from flask_security.utils import hash_password

def create_data(user_datastore : SQLAlchemySessionUserDatastore):
    user_datastore.find_or_create_role(name='admin', description ='Administrator')
    user_datastore.find_or_create_role(name='user', description ='User')
    
    if not user_datastore.find_user(email = "admin@gmail.com"):
        user_datastore.create_user(email = "admin@gmail.com", password = hash_password("pass"),roles=['admin'])
    if not user_datastore.find_user(email = "stud_1@gmail.com"):
        user_datastore.create_user(email = "stud_1@gmail.com", password = hash_password("pass"),roles=['user'])
    
    db.session.commit()
        