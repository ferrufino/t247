require 'pqueue'
require 'thread'

class Ruler
	attr_reader :pqRequests, :mutex, :cv, :threads
	def initialize
		@pqRequests = PQueue.new
		@mutex = Mutex.new
		@cv = ConditionVariable.new
		@threads = []
		5.times do |i|
			@threads[i] = Thread.new { Evaluator.new(@pqRequests).run(@mutex, @cv) }
		end
	end
	def pushRequest(request)
		@mutex.synchronize {
			@pqRequests.push(request)
			puts "Adding to the PQueue"
			@cv.signal
		}
	end
	def exitThreads
		@threads.each { |t| t.exit }
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
	def run(mutex, cv)
		loop do
			mutex.synchronize {
				if @pqRequests.empty? then
					cv.wait(mutex)
				end
				request = @pqRequests.pop
				puts "Popped value from PQueue: " + request.to_s
			}
		end
	end
end

ruler = Ruler.new
requests = [5, 2, 4, 3, 9, 1, 10, 8, 7, 6]
requests.each { |request| ruler.pushRequest(request) }

print "Waiting until requests finish"
while not ruler.queueEmpty? do
	print "."
	sleep(1) #seconds
end
puts " done!"

ruler.exitThreads
