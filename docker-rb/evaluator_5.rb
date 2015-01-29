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
=begin
	Para escapar:
	'	->	\\'
	" (\")	->	\"
	\ (\\)	->	\\\\\\\\
=end
input = 'string1 string2 string3'
codigo = "#include<iostream>\n using namespace std;\n int main(){ string a, b, c; cin >> a >> b >> c; cout << \"\\\\\\\\\\\\\\\\\\\\\\\\\\'\\\\\\\\\"Hola\" << \"\\\\\\\\n\" << \\'o\\' << endl; return 0; }"

$replacements = [ ["\\\\", "\\\\\\\\\\\\\\\\"],["\\\"", "\\\\\\\\\""],["\\n", "\\\\\\\\n"],["\"", "\""],["\\'", "\\\\\\\\\\'"],["'", "\\'"] ]

$code="#include<iostream>\nusing namespace std;\nint main(){\nint a=3, b=7;\ncout << \"\\\\\\'\\\"Hola\" << \"\\n\" << 'o' << endl;\nreturn 0;\n}"

def f(ini,fin)
	return "" if ini>fin 
	$replacements.each { |row|
		pos=$code.index(row[0],ini)
		return f(ini,pos-1)+row[1]+f(pos+row[0].bytesize,fin) if pos!=nil && pos<=fin
	}
	return $code.byteslice(ini,fin-ini+1)
end

codigo=f(0,$code.bytesize-1)

#lol = "palabra "'"a"'""

#pruebas

#codigo="#include<iostream>\n using namespace std;\n int main(){ string a, b, c; cin >> a >> b >> c; cout << \"Output\" << endl << a << endl << b << endl << c << endl; }"


# Esta version, probada funcionando, hace el cambio de permisos del script timeout pero no lo utiliza. Se comprobo que efectivamente se inserta en el contenedor y se le otorgan permisos de ejecucion
commandCompile = ['bash','-c','echo -e $\''+codigo+'\' >> /etc/r.cpp && echo '+input+' >> /etc/input.txt && g++ /etc/r.cpp && chmod u+x /etc/timeout.pl']
# Compilar
container = Docker::Container.create('Image' => im.send(:id), 'Cmd' => commandCompile, 'Tty' => true) 
container.start
str = container.logs(stdout: true)
#puts tar_contents_raw.string 		# Imprime el string del archivo
# Ejecutar
#command = ['bash','-c','sleep 1 && /etc/timeout.pl -t 1 -m 100000 ./a.out < /etc/input.txt > /etc/output.txt']
#command = ['bash','-c','sleep 1 && /etc/timeout.pl -t 5 -m 100000 bash -c "./a.out < /etc/input.txt > /etc/output.txt" ']
command = ['bash','-c','( ./etc/timeout.pl -t 10 -m 100000 "bash -c \'./a.out < /etc/input.txt > sOut.txt\' 2>sExecErr.txt" ) 2> sErr.txt']
#command = ['bash','-c','( /etc/timeout.pl -t 10 -m 100000 "bash -c \'./a.out < /etc/input.txt > /etc/sOut.txt\' 2> /etc/sExecErr.txt" ) 2> /etc/sErr.txt']
#sleep 1
container=container.run(command,0) 
sleep 0.08
#str = container.logs(stdout: true)
#puts str

tar_contents_raw = StringIO.new
container.copy('/sOut.txt') { |chunk| tar_contents_raw.write(chunk) }
puts tar_contents_raw.string 		# Imprime el string del archivo
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


