require 'pqueue'
require 'thread'
require 'monitor'
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
		NUM_THREADS = 1
		def initialize
			@requestsQueue = PQueue.new do |requestA, requestB|
				requestA[:priority] > requestB[:priority]
			end
			@requestsQueue.extend(MonitorMixin)
			@empty_cond = @requestsQueue.new_cond
			@evaluators = Array.new
			NUM_THREADS.times do |i|
				@evaluators[i] = Ruler::Evaluator.new
			end
			self
		end

		def requestAttempt(priority, attemptID)
			@requestsQueue.synchronize do
				@requestsQueue.push({
					:priority => priority,
					:type => :attempt,
					:attemptID => attemptID
				})
				@empty_cond.signal
			end
			self
		end

		def requestTest(priority, attemptID, input, callback)
			@requestsQueue.synchronize do
				@requestsQueue.push({
					:priority => priority,
					:type => :test,
					:attemptID => attemptID,
					:input => input,
					:callback => callback
				})
				@empty_cond.signal
			end
			self
		end

		def getRequest
			@requestsQueue.synchronize do
				@empty_cond.wait_while { @requestsQueue.empty? }
				return @requestsQueue.pop
			end
		end
	end
end
