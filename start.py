from cirkit import app
from multiprocessing import Process

def start():
    app.run(host='0.0.0.0', port=5500, debug=True)

if __name__ == '__main__':
    p = Process(target=start)
    p.start()
    p.join()
