from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/withdraw', methods=['POST'])
def withdraw():
    withdraw_data = request.json
    print(withdraw_data)

    if withdraw_data:
        return {
                   'msg': 'Withdraw success'
               }, 200

    return {
               'msg': 'Could not withdraw'
           }, 400


if __name__ == '__main__':
    app.run(port=5000, host='75.119.156.5')
