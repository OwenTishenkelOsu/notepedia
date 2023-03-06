import docx2json
import json
from datetime import date
import os
from collections import OrderedDict
from flask import Flask, request

app = Flask(__name__)

def doc2json(input_file):
    #Just fancy notation for a method
    ordered = lambda doc, order: OrderedDict([(key, doc[key]) for key in order])

    #Convert string to a JSON file
    doc_json = json.loads(docx2json.convert(input_file))

    #Delete unnecesarry tags
    del doc_json['bold']
    del doc_json ['nonbold']

    #Add other tags
    doc_json['title'] = input_file
    doc_json['doctype'] = os.path.splitext(input_file)[1]
    doc_json['upload_date'] = date.today().strftime("%d_%m_%Y")

    #Define key order
    order = ["title", "doctype", "text", "upload_date"]

    #Sort dictionary
    doc_json = ordered(doc_json, order)

    #Convert back to a string
    doc_json = json.dumps(doc_json, indent=4)

    return doc_json

@app.route('/test', methods=['GET', 'POST'])
def handleRequests():
    #if POST request
    test = None
    if request.method == 'POST':
        test = request.args
        print(f"test = {test}")
    
    if request.method == 'GET':
        input_file = 'test.docx'

        #Just fancy notation for a method
        ordered = lambda doc, order: OrderedDict([(key, doc[key]) for key in order])

        #Convert string to a JSON file
        doc_json = json.loads(docx2json.convert(input_file))

        #Delete unnecesarry tags
        del doc_json['bold']
        del doc_json ['nonbold']

        #Add other tags
        doc_json['title'] = input_file
        doc_json['doctype'] = os.path.splitext(input_file)[1]
        doc_json['upload_date'] = date.today().strftime("%d_%m_%Y")

        #Define key order
        order = ["title", "doctype", "text", "upload_date"]

        #Sort dictionary
        doc_json = ordered(doc_json, order)

        #Convert back to a string
        doc_json = json.dumps(doc_json, indent=4)

        return doc_json
        # with open(output_file, 'w') as f:
        #     f.write(doc_json)

if __name__ == '__main__':
    app.run(port=8000)