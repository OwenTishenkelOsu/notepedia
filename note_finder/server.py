import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO
import requests

import docx2json


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        file_data = self.rfile.read(content_length)

        print(docx_file)
        # Convert .docx file to JSON
        docx_file = BytesIO(file_data)
        json_data = json.dumps(docx2json.convert(docx_file))

        # Send JSON response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json_data.encode())

    def do_GET(self):
        x = requests.get("http://localhost:3000")
        print(x.text())
        # Serve the requested file
       

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f'Starting server on http://localhost:{server_address[1]}')
    httpd.serve_forever()