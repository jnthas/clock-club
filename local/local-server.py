from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import socket

def getLocalIP():
    # Get the local IP to be used in local server e.g. 192.168.x.x 
    # use ifconfig in case it doesn't return the correct ip address
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    localip = s.getsockname()[0]
    s.close()
    return localip

def createServer():
    localip = getLocalIP()
    print("Creating SSL Server on local IP {} and port 4443 ".format(localip))
    print("Please, put the same IP address in the card called '[Canvas] Server Address' in the settings page of Clockwise")
    
    httpd = HTTPServer((localip, 4443), SimpleHTTPRequestHandler)

    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain("server.pem")
    httpd.socket = ssl_context.wrap_socket(
    httpd.socket,
    server_side=True,
    )

    #httpd.socket = ssl.wrap_socket (httpd.socket, keyfile="privatekey.pem", certfile='certificate.pem', server_side=True)
    
    print("Serving '/'...")
    httpd.serve_forever()
    

createServer()
