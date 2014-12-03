# Version 1
# Se asume que la imagen 'ubuntu' ya tiene el compilador g++
# El script debe ser ejecutado asi: ruby evaluator.rb > output.tar
# dado que la API solo imprime resultados en consola. Aun no se si 
# es posible que mande la informacion directo a un .txt, la documentacion pone como ejemplo que se manda a un .tar
require 'docker'

c=Docker::Container.create('Image' => 'ubuntu', 'Cmd' => ['bash','-c','echo "CODE" > /etc/r.cpp && g++ /etc/r.cpp && ./a.out > output.txt'])
c.start
c.copy('/output.txt') { |chunk| puts chunk }

# Version 2
# Se crea un contenedor basado en una imagen a la que se le instala g++
# Misma situacion que la version anterior en torno a la impresion de resultados

require 'docker'

# Se crea una imagen en la cual se instala g++
i=Docker::Image.build("from ubuntu:14.04\nrun apt-get install g++")
# Se crea un contenedor en el que se ejecuta el codigo
c=i.run('Cmd' => ['bash','-c','echo "CODE" > /etc/r.cpp && g++ /etc/r.cpp && ./a.out > output.txt'])
c.start
c.copy('/output.txt') { |chunk| puts chunk }

