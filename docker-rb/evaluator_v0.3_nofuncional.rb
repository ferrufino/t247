=begin
Version no funcional
=end

require 'docker'

im=Docker::Image.build("FROM ubuntu:14.04\nMAINTAINER Sergio msf1013@gmail.com\nRUN apt-get update && apt-get install -y build-essential")

# Esta linea inserta el script timeout en la imagen de Docker. Jala el archivo de forma local
im=im.insert_local('localPath' => '/home/msf1013/Desktop/Docker-rb/timeout', 'outputPath' => '/etc/')

input = '35 66'
codigo = "\"#include<iostream>\n using namespace std;\n int main(){ int a, b; cin >> a >> b; cout << a+b << endl; }\""

# Esta version se intenta correr el ejecutable mediante el timeout. Como parametros se indican 10,000 KB de memoria y 5 segundos
# El error producido (y que se almacena en la variable str a la que se redirige el stdout) es: bash: line 2: /etc/timeout: Text file busy\r\n Se supone que eso indica que el script de perl timeout se esta intentando ejecutar cuando algo lo esta accediendo con permiso de escritura
command = ['bash','-c','echo -e '+codigo+' >> /etc/r.cpp && echo '+input+' >> /etc/input.txt && g++ /etc/r.cpp && chmod u+x /etc/timeout && /etc/timeout -m 100000 -t 5 ./a.out < /etc/input.txt']

container = Docker::Container.create('Image' => im.send(:id), 'Cmd' => command, 'Tty' => true) 

container.start

# El stdout del contenedor se redirige a una variable  
str = container.logs(stdout: true)

print str
