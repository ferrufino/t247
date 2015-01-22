require 'thread'
require 'base64'
require 'stringio'
require 'docker'

module Ruler
	class Evaluator
		testMemoryLimit = 50000
		testTimeLimit = 5
		image = 'evaluator'
		def initialize
			@container = Docker::Container.create('Image' => image, 'Tty' => true)
			@container.start
			@thread.new do
				self.run
			end
			self
		end
		
		def exit
			#self.deleteContainer
			self.stopContainer
			@thread.exit
		end
		
		def deleteContainer
			@container.delete(:force => true)
		end

		def stopContainer
			@container.stop
		end

		def run
			loop do
				request = Ruler::Manager.getRequest
				if request[:type] == :attempt then
					self.evaluateAttempt(request)
				elsif request[:type] == :test then
					self.evaluateTest(request)
				end
			end
		end

		def evaluateAttempt(request)
			attempt = Attempt.find(request[:attemptID])
			# TODO: verificar funcionamiento con los modelos de Rails
			code = self.formatCode(attempt.code)
			cases = attempt.problem.cases
			compilerCommand = Ruler.compilers[attempt.language]
			runCommand = Ruler.runners[attempt.language]
			wrong = false
			attempt.state = nil

			self.insertInContainer(code, attempt.language)
			if !compilerCommand.nil? then
				self.compileInContainer(compiler, attempt.language)
				# TODO: validar errores de compilacion
			end
			if !runCommand.nil? then
				attempt.grade = 0
				cases.each do |testCase|
					timeLimit = testCase.memoryLimit
					memoryLimit = testCase.memoryLimit
					self.runInContainer(attempt.language)

					output = self.getFileContent('sOut.txt')
					errors = self.getFileContent('sExecErr.txt')
					timeout = self.getFileContent('sEst.txt')

					if timeout.match(/^TIME LIMIT/) then
						attempt.state = Ruler::AttemptStatus.TIME_LIMIT_ERROR
					elsif timeout.match(/^MEMORY LIMIT/) then
						attempt.state = Ruler::AttemptStatus.MEMORY_LIMIT_ERROR
					end

					if !errors.nil? || !errors.empty? then
						attempt.state = Ruler::AttemptStatus.RUNTIME_ERROR
					end

					attempt.result = attempt.result + output
					if output.eq? testCase.output then
						attempt.grade += 1
					elsif !wrong
						feedback = testCase.feedback
						wrong = true
					end
				end
				attempt.grade = attempt.grade / cases.count

				if attempt.state.nil? && !wrong then
					attempt.state = Ruler::AttemptStatus.ACCEPTED
				elsif attempt.state.nil? && wrong then
					attempt.state = Ruler::AttemptStatus.INCOMPLETE
				end

				attempt.save
			elsif then
				# TODO: imprimir error de lenguaje no soportado 
			end
		end

		def evaluateTest(request)
			# TODO: implementar
		end

		def formatCode(str)
			str.gsub(/[\'\\]/, '\\' => "\\\\\\\\", '\'' => "\\\'")
		end

		def insertInContainer(code, language)
			command = ['bash', '-c', 'echo -e $\'' + code + '\' >> /etc/code' + Ruler.extensions[language]]
			@container = @container.run(command, 0)
			@container.wait(10)
		end

		def compilerInContainer(compiler, language)
			command = ['bash', '-c', compiler + ' /etc/code' + Ruler.extensions[language]]
			@container = @container.run(command, 0)
			@container.wait(10)
		end

		def runInContainer(language)
			command = ['bash', '-c', '( /etc/timeout.pl -t ' + timeLimit + ' -m ' + memoryLimit + ' "bash -c \'' + Ruler.runners[language] + ' < echo ' + input + ' > sOut.txt\' 2>sExecErr.txt" ) 2> sEst.txt']
			@container = @container.run(command, 0)
			@container.wait(10)
		end

		def getFileContent(fileName)
			tar_contents_raw = StringIO.new
			@container.copy(fileName) do |chunk|
				tar_contents_raw.write(chunk)
			end
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
	end
end
