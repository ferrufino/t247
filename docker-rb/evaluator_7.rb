require 'base64'
require 'stringio'
require 'docker'

# Funcion que devuelve string con el contenido de un archivo dentro del contenedor
def fileContent(container, fileName)
	tar_contents_raw = StringIO.new
	container.copy(fileName) { |chunk| tar_contents_raw.write(chunk) }
	str64 = Base64.encode64(tar_contents_raw.string)
	str64 = str64.chomp
	tar_contents_encoded = StringIO.new(Base64.decode64(str64))
	reader = Archive::Tar::Minitar::Reader::open(tar_contents_encoded)
	strContent=""
	reader.each_entry do |e|
	  next if e.directory?
	  banner = "#{e.name}: #{e.size}"
	  separator = '-' * banner.size
	  strContent=e.read
	end
	return strContent
end

# Funcion para reemplazar caracteres especiales en codigo
$replacements = [ ["\\", "\\\\\\\\"],["'", "\\'"] ]
$code="#include<iostream>\nusing namespace std;\nint main(){\nint a=3, b=7;\ncout << \"\\\\\\'\\\"Hola\" << \"\\n\" << 'o' << endl;\nreturn 0;\n}"
input = 'string1 string2 string3'

def f(code)
	str=""
	for i in 0..code.bytesize-1
		if code[i]=='\\'
			str=str+"\\\\\\\\"
		elsif code[i]=='\''
			str=str+"\\'"
		else
			str=str+code[i]
		end
	end
	return str
end

def formatCode(str)
	str.gsub(/[\'\\]/, '\\' => "\\\\\\\\", '\'' => "\\\'")
end
#prueba

codigo=formatCode($code)

# Creacion de la imagen de Ubuntu e insercion de archivo timeout.pl
im=Docker::Image.build("FROM ubuntu:14.04\nMAINTAINER Sergio msf1013@gmail.com\nRUN apt-get update && apt-get install -y build-essential")
im=im.insert_local('localPath' => '/home/msf1013/Desktop/Docker-rb/timeout.pl', 'outputPath' => '/etc/')

# Comando de compilacion de codigo
commandCompile = ['bash','-c','echo -e $\''+codigo+'\' >> /etc/r.cpp && echo '+input+' >> /etc/input.txt && g++ /etc/r.cpp && chmod u+x /etc/timeout.pl']

# Creacion del contenedor con el comando de compilacion
container = Docker::Container.create('Image' => im.send(:id), 'Cmd' => commandCompile, 'Tty' => true) 
container.start

# Comando de ejecucion y lanzamiento del comando en el contenedor
command = ['bash','-c','( ./etc/timeout.pl -t 10 -m 100000 "bash -c \'./a.out < /etc/input.txt > sOut.txt\' 2>sExecErr.txt" ) 2> sEst.txt']
container=container.run(command,0) 
container.wait(5)

# Impresion de contenido de archivos de compilacion y ejecucion

# Output (sOut.txt)
puts "1) Output (sOut.txt)"
puts fileContent(container,"sOut.txt")
puts "-------------------------------"

# Errores de ejecucion (sExecErr.txt)
puts "2) Errores de ejecucion (sExecErr.txt)"
puts fileContent(container,"sExecErr.txt")
puts "-------------------------------"

# Estadisticas de ejecucion (sEst.txt)
puts "3) Estadisticas de ejecucion (sEst.txt)"
puts fileContent(container,"sEst.txt")
puts "-------------------------------"


