import os
import pathlib
from mimetypes import guess_type
from flask import Flask, send_file, request
from flask.templating import render_template

app = Flask(__name__)
mainPath = pathlib.Path(__file__).parent.absolute()

@app.route('/')
def index():
    files = [{"filename": os.path.splitext(f)[0], "type": guess_type(f)[0].split('/')[0]} for f in os.listdir(os.path.join(mainPath, 'media')) if os.path.isfile(os.path.join(mainPath, 'media', f))]
    print(files)
    return render_template('index.html', files = files)

@app.route('/settings')
def settings():
    return "Well, there aren't really any settings yet."

@app.route('/media/<filename>')
def media(filename):
    as_attachment = request.args.get('as_attachment') == "true"
    return send_file(os.path.join(mainPath, 'media', filename), as_attachment=as_attachment)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)