require 'pqueue'
require 'thread'
require 'singleton'

module Ruler
	Compilers = {
		"C++" => "g++",
		"Java" => "javac"
	}
	Runners = {
		"C++" => "./a.out",
		"Java" => "java Main.class" # Requiere que la clase tenga el nombre Main y el archivo se nombre Main.java
	}
	Extensions = {
		"C++" => ".cpp",
		"Java" => ".java"
	}
	class Manager
		include Singleton
		NUM_THREADS = 5
		def initialize
			@requestsQueue = PQueue.new do |requestA, requestB|
				requestA[:priority] > requestB[:priority]
			end
			@lock = Mutex.new
			@semaphore = ConditionVariable.new
			@evaluators = Array.new
			NUM_THREADS.times do |i|
				@evaluators[i] = Ruler::Evaluator.new
			end
			self
		end

		def requestAttempt(priority, attemptID)
			@lock.synchronize do
				@requestsQueue.push({
					:priority => priority,
					:type => :attempt,
					:attemptID => attemptID
				})
				@semaphore.signal
			end
			self
		end

		def requestTest(priority, attemptID, input, callback)
			@lock.synchronize do
				@requestsQueue.push({
					:priority => priority,
					:type => :test,
					:attemptID => attemptID,
					:input => input,
					:callback => callback
				})
				@semaphore.signal
			end
			self
		end

		def getRequest
			@lock.synchronize do
				@semaphore.wait(lock) if @requestsQueue.empty?
				return @requestsQueue.pop
			end
		end
	end
end
