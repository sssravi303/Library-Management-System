from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin,RoleMixin
from flask_security.models import fsqla_v3 as fsqla

db=SQLAlchemy()

fsqla.FsModels.set_db_info(db)

class UserRoles(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer,db.ForeignKey('role.id'))

class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,unique=True)
    description = db.Column(db.String)

class User(db.Model,UserMixin):
    id = db.Column(db.Integer,primary_key= True)
    email= db.Column(db.String,nullable=False,unique = True)
    password = db.Column(db.String)
    wallet_amount = db.Column(db.Integer,nullable=False,default = 1000)
    active = db.Column(db.Boolean)
    fs_uniquifier= db.Column(db.String,unique=True,nullable=False)
    no_of_books_owned = db.Column(db.Integer,nullable=False,default=0)
    roles = db.relationship('Role',secondary="user_roles")

class Book(db.Model):
    id=db.Column(db.Integer(),primary_key=True,nullable=False,unique=True)
    book_name=db.Column(db.String(),nullable=False)
    book_id=db.Column(db.String(),nullable=False,unique=True)
    author=db.Column(db.String(),nullable=False)
    section_id=db.Column(db.Integer(),db.ForeignKey('section.section_id'),nullable=False)
    content=db.Column(db.LargeBinary)
    amount=db.Column(db.Integer())
    file_name=db.Column(db.String())
    
class Section(db.Model):
    id=db.Column(db.Integer(),primary_key=True,nullable=False,unique=True)
    section_id=db.Column(db.Integer(),nullable=False,unique=True)
    section_name=db.Column(db.String(),nullable=False,unique=True)
    created_on=db.Column(db.String(),nullable=False)
    description=db.Column(db.String())
    book=db.relationship("Book",backref="section",cascade="all,delete")

class Requests(db.Model):
    id=db.Column(db.Integer(),primary_key=True,nullable=False,unique=True)
    user_id=db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    bookid=db.Column(db.String(),nullable=False)
    book_name=db.Column(db.String(),nullable=False)
    requested_date=db.Column(db.String(),nullable=False)
    granted_date=db.Column(db.String())
    return_date=db.Column(db.String())  
    status=db.Column(db.String(),nullable=False)
    section_id=db.Column(db.Integer(),db.ForeignKey('section.section_id'),nullable=False)

class Feedback(db.Model):
    id=db.Column(db.Integer(),primary_key=True,nullable=False,unique=True)
    book_id=db.Column(db.String(),nullable=False)
    user_id=db.Column(db.Integer(),nullable=False)
    rating=db.Column(db.Integer(),nullable=False)
    description=db.Column(db.String())