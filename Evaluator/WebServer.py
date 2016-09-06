import socketserver

class WebServer(socketserver.BaseRequestHandler):
    def handle(self):
        data = self.request[0]
        print("data: " + str(data, encoding ="utf-8"))

if __name__ == "__main__":
    HOST, PORT = "localhost", 1013
    server = socketserver.UDPServer((HOST, PORT), WebServer)
    server.serve_forever()
