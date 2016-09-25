import socketserver
import multiprocessing
import threading
from Judge import Judge

queues = []
lock = threading.Lock()
total_judges = 4

# Custom RequestHandler for incoming Evaluation requests
class LoadBalancerRequestHandler(socketserver.BaseRequestHandler):

    # Redirect Evaluation request to least busy Judge
    def handle(self):
    
        global judges, queues, total_judges
        rawData = self.request[0]
        print("Llego esto al LoadBalancer: data - " + str(rawData, encoding="utf-8"))
        
        # Start queues access
        lock.acquire()
        
        #Choose least busy Judge
        pos = 0
        tam = queues[0].qsize()    

        for i in range(1, total_judges):
            if queues[i].qsize() < tam:
                tam = queues[i].qsize()
                pos = i

        # Send Evaluation request to chosen Judge
        queues[pos].put(rawData)

        # End queues access
        lock.release()

# Launch LoadBalancer process
if __name__ == "__main__":
    
    # Create Judge subprocesses
    for i in range(total_judges):
        q = multiprocessing.Queue()        
        queues.append(q)
        p = Judge(i, q)
        p.start()    

    # Instantiate server process
    HOST, PORT = "localhost", 777
    server = socketserver.UDPServer((HOST, PORT), LoadBalancerRequestHandler)
    server.serve_forever()
