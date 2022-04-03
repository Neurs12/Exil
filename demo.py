from flask import stream_with_context, request, Response, Flask
from time import sleep

app = Flask(__name__)

@app.route('/stream')
def streamed_response():
    def generate():
        yield 'Hello '
        sleep(1)
        yield "world!"
        sleep(2)
        yield '!'
    return Response(stream_with_context(generate()))

app.run("0.0.0.0", port = 8080)
