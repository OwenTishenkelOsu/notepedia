import json
from datetime import date
from collections import OrderedDict
from flask import Flask, request, session
from flask_session import Session
import requests
from docx import Document
from collections import defaultdict
import os
from werkzeug.datastructures import ImmutableMultiDict

app = Flask(__name__)
#Declare that sessions do not have time limits
app.config["SESSION_PERMANENT"] = False
#Declare that session is stored on file system
app.config["SESSION_TYPE"] = "filesystem"
#A session is a way of storing data btw POST and GET requests
app.config['SESSION_REFRESH_EACH_REQUEST'] = False
app.secret_key = 'I have to set this'
Session(app)

def doc2json(doc):
    #A defaultdict is like a regular dictionary
    #except it cannot declare a key error
    #the 'default' value or value that is returned
    #if there is no key is defined in the constructor
    #as a method
    doc_json = defaultdict(lambda: "No value was entered")

    #Define key order
    #order = ["title", "doctype", "text", "upload_date"]

    #Just fancy notation for a method
    #Orders the keys in a dictionary
    #ordered = lambda doc, order: OrderedDict([(key, doc[key]) for key in order])

    #Extract document text
    text = '\n'.join([para.text for para in doc.paragraphs])

    #Add tags
    doc_json['title'] = str(doc.core_properties.title) if doc.core_properties.title != "" else "default_title"
    doc_json['text'] = text
    doc_json['doctype'] = 'docx'
    doc_json['upload_date'] = date.today().strftime("%d_%m_%Y")

    #Sort dictionary
    #doc_json = ordered(doc_json, order)

    #Convert back to a string
    try:
        doc_json = json.dumps(doc_json, indent=4)
        #print(f"Formatted json is: {doc_json}")
    except Exception as e:
        print("doc_json could not be converted to a string")
        return "fail", 500

    headers = {"Authorization": "Basic ZWxhc3RpYzpwYXNzd29yZA==; Content-Type: application/json"}
    requests.post("http://localhost:9200/notes/_doc", data=doc_json, headers=headers)
    return "success", 200

@app.route('/send', methods=['POST'])
def handlePostRequest():
    #if POST request
    if request.method == 'POST':
        file = request.files['file']
        filename = file.filename
        response = ()
        print("About to display the file here we go")
        print(f"test = {file}")
        print("Haha woah that was fun")
        cwd = os.getcwd()+'/'
        if 'temp' not in os.listdir(cwd):
            os.mkdir(cwd + 'temp')
        file.save(os.path.join(cwd + 'temp', filename))

        with open(cwd + 'temp/' + filename, 'rb') as f:
            data_file = ImmutableMultiDict([("file", f)])
            print(f"DATA FILE IS {data_file}")
            doc = Document(f)
            #session['doc'] = doc2json(doc)
            response = doc2json(doc)
            session['res'] = str(response[0])
        file.close()
        os.remove(cwd + f'temp\{filename}')

        print(f"session SID for POST is: {session.sid}")

        return response
    
@app.route('/get', methods=['GET'])
def handleGetRequest():
    if request.method == 'GET':
        print(f"session SID for GET request is: {session.sid}")
        res = session.get('res', None)
        return res

if __name__ == '__main__':
    app.run(port=8000)