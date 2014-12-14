=begin
Las instrucciones del script funcionan si se ingresan una por una en la consola ineractiva de ruby irb. No  funciona si se lanza el script.
=end

require 'docker'

im=Docker::Image.build("FROM ubuntu:14.04\nMAINTAINER Sergio msf1013@gmail.com\nRUN apt-get update && apt-get install -y build-essential")

# Esta linea inserta el script timeout en la imagen de Docker. Jala el archivo de forma local
im=im.insert_local('localPath' => '/home/msf1013/Desktop/Docker-rb/timeout', 'outputPath' => '/etc/')

input = '35 66'
codigo = "\"#include<iostream>\n using namespace std;\n int main(){ int a, b; cin >> a >> b; cout << a+b << endl; }\""

# Esta version, probada funcionando, hace el cambio de permisos del script timeout pero no lo utiliza. Se comprobo que efectivamente se inserta en el contenedor y se le otorgan permisos de ejecucion
command = ['bash','-c','echo -e '+codigo+' >> /etc/r.cpp && echo '+input+' >> /etc/input.txt && g++ /etc/r.cpp && chmod u+x /etc/timeout && ./a.out < /etc/input.txt']

container = Docker::Container.create('Image' => im.send(:id), 'Cmd' => command, 'Tty' => true) 

container.start

# El stdout del contenedor se redirige a una variable  
str = container.logs(stdout: true)

print str
