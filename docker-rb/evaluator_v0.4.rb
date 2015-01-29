=begin
Las instrucciones del script funcionan si se ingresan una por una en la consola ineractiva de ruby irb. No  funciona si se lanza el script. En esta version se ejecuta el codigo mediante el script evaluador timeout, aunque las estadisticas no se redirigen
a una archivo especial. Para visualizarlas es necesario imprimir los logs del contenedor.
=end

require 'base64'
require 'stringio'
require 'docker'

im=Docker::Image.build("FROM ubuntu:14.04\nMAINTAINER Sergio msf1013@gmail.com\nRUN apt-get update && apt-get install -y build-essential")

# Esta linea inserta el script timeout en la imagen de Docker. Jala el archivo de forma local
im=im.insert_local('localPath' => '/home/msf1013/Desktop/Docker-rb/timeout.pl', 'outputPath' => '/etc/')

input = 'string1 string2 string3'
codigo = "\'#include<iostream>\n using namespace std;\n int main(){ string a, b, c; cin >> a >> b >> c; cout << \"Output\" << endl << a << endl << b << endl << c << endl; }\'"

# Esta version, probada funcionando, hace el cambio de permisos del script timeout pero no lo utiliza. Se comprobo que efectivamente se inserta en el contenedor y se le otorgan permisos de ejecucion
command = ['bash','-c','echo -e '+codigo+' >> /etc/r.cpp && echo '+input+' >> /etc/input.txt && g++ /etc/r.cpp && chmod u+x /etc/timeout.pl && sleep 1 && /etc/timeout.pl -t 1 -m 100000 ./a.out < ./etc/input.txt > ./etc/output.txt']

container = Docker::Container.create('Image' => im.send(:id), 'Cmd' => command, 'Tty' => true) 

container.start

tar_contents_raw = StringIO.new
container.copy('/etc/output.txt') { |chunk| tar_contents_raw.write(chunk) }
#puts tar_contents_raw.string 		// Imprime el string del archivo
#str = container.logs(stdout: true)	// Imprime las estadisticas de timout, por ahora

str64 = Base64.encode64(tar_contents_raw.string)
str64=str64.chomp

tar_contents_encoded = StringIO.new(Base64.decode64(str64))
reader = Archive::Tar::Minitar::Reader::open(tar_contents_encoded)
strOutput=""
reader.each_entry do |e|
  next if e.directory?
  banner = "#{e.name}: #{e.size}"
  separator = '-' * banner.size
  strOutput=e.read
end

print strOutput

#strOutput=="Output\nstring1\nstring2\nstring3\n"


