require 'pqueue'
require 'thread'
require 'singleton'

class Ruler
	include Singleton
	attr_reader :pqRequests, :mutex, :threads
	def initialize
		@pqRequests = PQueue.new
		@mutex = Mutex.new
		@threads = []
		5.times do |i|
			@threads[i] = Thread.new do
				Evaluator.new(@pqRequests).run(@mutex)
			end
		end
	end
	def pushRequest(request)
		@mutex.synchronize do
			@pqRequests.push(request)
			puts "Adding to the PQueue"
		end
	end
	def exitThreads
		@threads.each do
			|t| t.exit
		end
	end
	def queueEmpty? 
		@pqRequests.empty?
	end
end

class Evaluator
	attr_reader :pqRequests
	def initialize(pqRequests)
		@pqRequests = pqRequests
	end
	def run(mutex)
		loop do
			mutex.synchronize do
				if not @pqRequests.empty? then
					request = @pqRequests.pop
					puts "Popped value from PQueue: " + request.to_s
				end
			end
			sleep(0.1)
		end
	end
end

ruler = Ruler.instance
requests = [5, 2, 4, 3, 9, 1, 10, 8, 7, 6]
requests.each do
	|request| ruler.pushRequest(request)
end

print "Waiting until requests finish"
while not ruler.queueEmpty? do
	print "."
	sleep(0.5) #seconds
end
puts " done!"

ruler.exitThreads
