=begin
Este script es la primera version funcional del evaluador de codigo del Tutoring 24/7,
que hace uso de la API de Docker en Ruby (docker-api). Quiza los comentarios terminen 
siendo mas extensos que el codigo mismo, hay que considerar que aun falta agregarle
algunos elementos esenciales.
Esta version tiene un comportamiento irregular: no funciona si se ejecuta desde shell
como "ruby evaluator_v1.rb", pero si el contenido se ejecuta desde la terminal de Ruby
(irb), funciona completamente. 
=end

require 'docker'

# Se crea un objeto "imagen", que se contruye a partir de la version 14.04 de Ubuntu,
# sobre la que se instala la libreria build-essential (para compilar C/C++).
# Ademas, para fines de prueba, en la creacion de la imagen se crea tambien el archivo input.txt, 
# cuyo contenido son los datos de entrada del problema.
im=Docker::Image.build("FROM ubuntu:14.04\nMAINTAINER Sergio msf1013@gmail.com\nRUN apt-get update && apt-get install -y build-essential && echo '25' >> /etc/input.txt")

# Se crea un contenedor que "carga" la imagen previamente generada, y se envia como parametro
# el codigo a evaluar, el cual toma los datos de entrada de input.txt y despliega los resultados en output.txt
sss=Docker::Container.create('Image' => im.send(:id), 'Cmd' =>['bash','-c','echo -e "#include<iostream>\n using namespace std;\n int main(){ int a; cin >> a; cout << a << endl; }" >> /etc/r.cpp && g++ /etc/r.cpp && ./a.out < etc/input.txt > /etc/output.txt'])

# Se ejecuta el contenedor
sss.start

# Se envia el contenido de output.txt al "host", es decir
# fuera del ambiente virtual de Docker en la direccion especificada
File.open('/home/msf1013/Desktop/Docker-rb/output.tar','w') do |file|
  sss.copy('/etc/output.txt') do |chunk|
    file.write(chunk)
  end
end

=begin
Pendientes clave:
1) Buscar manera eficiente de enviar archivo de input al contenedor.
2) Instalar compiladores de multiples lenguajes.
3) Manejo de multiples casos de prueba.
4) Control de memoria y tiempo: quiza pueda hacerse fuera del ambiente virtual de Docker,
   es decir, que se controle desde "host"
5) Buscar si es posible enviar el output.txt fuera del contenedor sin necesidad de un .tar
6) Hacer que el codigo funcione ejecutandose desde el script de Ruby.
=end
