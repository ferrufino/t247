require 'thread'
require 'base64'
require 'stringio'
require 'docker'

module Ruler
	class Evaluator
		TEST_MEM_LIMIT = 50000
		TEST_TIME_LIMIT = 5
		IMAGE_TAG = 't247/evaluator:v1'
		def initialize
			@container = Docker::Container.create('Image' => IMAGE_TAG, 'Tty' => true)
			@container.start
			@thread = Thread.new do
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
				request = Ruler::Manager.instance.getRequest
				if request[:type] == :attempt then
					self.evaluateAttempt(request)
				elsif request[:type] == :test then
					self.evaluateTest(request)
				end
			end
		end

		def evaluateAttempt(request)
			attempt = Attempt.find(request[:attemptID])
			code = self.formatCode(attempt.code)
			puts "My formatted code:"
			puts code
			cases = attempt.problem.cases
			compilerCommand = Ruler::Compilers[attempt.language]
			runCommand = Ruler::Runners[attempt.language]
			wrong = false
			feedback = nil
			puts "All set up to evaluate!"

			self.insertInContainer(code, attempt.language)
			if !compilerCommand.nil? then
				self.compileInContainer(compiler, attempt.language)
				puts "All compiled"
				# TODO: validar errores de compilacion
			end
			if !runCommand.nil? then
				attempt.grade = 0
				puts "About to start running test cases"
				cases.each do |testCase|
					timeLimit = testCase.memoryLimit
					memoryLimit = testCase.memoryLimit
					self.runInContainer(attempt.language, timeLimit, memoryLimit)

					output = self.getFileContent('sOut.txt')
					errors = self.getFileContent('sExecErr.txt')
					timeout = self.getFileContent('sEst.txt')

					if timeout.match(/^TIME LIMIT/) then
						puts Ruler::AttemptStatus::TIME_LIMIT_ERROR
						attempt.state = Ruler::AttemptStatus.TIME_LIMIT_ERROR
					elsif timeout.match(/^MEMORY LIMIT/) then
						puts Ruler::AttemptStatus::MEMORY_LIMIT_ERROR
						attempt.state = Ruler::AttemptStatus.MEMORY_LIMIT_ERROR
					end

					if !errors.nil? || !errors.empty? then
						puts Ruler::AttemptStatus::RUNTIME_ERROR
						attempt.state = Ruler::AttemptStatus.RUNTIME_ERROR
					end

					attempt.result = attempt.result + output
					if output.eq? testCase.output then
						attempt.grade += 1
					elsif !wrong then
						feedback = testCase.feedback
						wrong = true
					end
					"Test case done!"
				end
				attempt.grade = attempt.grade / cases.count

				if attempt.state.nil? && !wrong then
					attempt.state = Ruler::AttemptStatus.ACCEPTED
				elsif attempt.state.nil? && wrong then
					attempt.state = Ruler::AttemptStatus.INCOMPLETE
					attempt.feedback = feedback
				end

				attempt.save
			else
				puts "ERROR: Unsupported language ${attempt.language}"
			end
		end

		def evaluateTest(request)
			# TODO: implementar
		end

		def formatCode(str)
			str.gsub(/[\'\\]/, '\\' => '\\\\\\\\', '\'' => '\\\'')
		end

		def insertInContainer(code, language)
			command = ['bash', '-c', 'echo -e $\'' + code + '\' >> /etc/code' + Ruler::Extensions[language]]
			puts "Calling container"
			@container = @container.run(command, 0)
			puts "Running insertInContainer"
			@container.wait(10)
		end

		def compileInContainer(compiler, language)
			command = ['bash', '-c', compiler + ' /etc/code' + Ruler::Extensions[language]]
			@container = @container.run(command, 0)
			@container.wait(10)
		end

		def runInContainer(language, timeLimit, memoryLimit)
			command = ['bash', '-c', '( /etc/timeout.pl -t ' + timeLimit + ' -m ' + memoryLimit + ' "bash -c \'' + Ruler::Runners[language] + ' < echo ' + input + ' > sOut.txt\' 2>sExecErr.txt" ) 2> sEst.txt']
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
