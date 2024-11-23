from celery import shared_task
import time
from flask_excel import make_response_from_query_sets
from models import Book
from mail_service import send_email
# @shared_task() # makes it a celery task
# def add(x,y):
#     time.sleep(15)
#     return x+y

@shared_task(ignore_task = True) #Will not store the data in the celery backend
def export_job():
    req = Book.query.with_entities(Book.book_id, Book.book_name).all()
    csv_out = make_response_from_query_sets(req,['book_id','book_name'],file_type='csv', file_name="file.csv")

    with open('./user_downloads/file.csv', 'wb') as file:
        file.write(csv_out.data)
        
    return 'file.csv'

@shared_task(ignore_task = True)
def daily_reminder(to,subject,message):
    send_email(to,subject,message)
    return "Mail Sent"