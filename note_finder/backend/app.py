from flask import Flask

app = Flask(__name__)
#CORS(app)

@app.route("/")
def hello():
    print("hello world!")

@app.route("/search", methods=["GET"])
def search():
    with open("examples/kung_fu_panda_analysis.txt", "r") as f:
        #read 5 lines from the file
        summary = [next(f) for x in range(5)]

    return summary

if __name__ == "__main__":
    app.run("localhost", 3000)